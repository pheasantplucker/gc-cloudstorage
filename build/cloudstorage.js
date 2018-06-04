'use strict';

let exists = (() => {
  var _ref3 = _asyncToGenerator(function* (filename) {
    const { bucketpart } = split_filename(filename);
    try {
      // first check that the bucket exists
      const r1 = bucketExists(bucketpart);
      if (isFailure(r1)) return r1;
      if (payload(r1) === false) return success(false);
      const fileHandle = getFileHandle(filename);
      const result = yield fileHandle.exists();
      return success(result[0]);
    } catch (e) {
      return failure(e.toString());
    }
  });

  return function exists(_x3) {
    return _ref3.apply(this, arguments);
  };
})();

let save = (() => {
  var _ref4 = _asyncToGenerator(function* (filename, data) {
    try {
      const fileHandle = getFileHandle(filename);
      const result = yield fileHandle.save(data);
      return success(result);
    } catch (e) {
      return failure(e.toString());
    }
  });

  return function save(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
})();

let getReadStream = (() => {
  var _ref5 = _asyncToGenerator(function* (filename, opts) {
    try {
      const fileHandle = getFileHandle(filename);
      const result = fileHandle.createReadStream();
      return success(result);
    } catch (e) {
      return failure(e.toString());
    }
  });

  return function getReadStream(_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
})();

let createWriteStream = (() => {
  var _ref6 = _asyncToGenerator(function* (filename, opts) {
    try {
      const fileHandle = getFileHandle(filename);
      const result = fileHandle.createWriteStream();
      return success(result);
    } catch (e) {
      return failure(e.toString());
    }
  });

  return function createWriteStream(_x8, _x9) {
    return _ref6.apply(this, arguments);
  };
})();

let deleteFile = (() => {
  var _ref9 = _asyncToGenerator(function* (filename) {
    try {
      const fileHandle = getFileHandle(filename);
      const result = yield fileHandle.delete();
      return success(result);
    } catch (e) {
      return failure(e.toString());
    }
  });

  return function deleteFile(_x13) {
    return _ref9.apply(this, arguments);
  };
})();

let deleteBucket = (() => {
  var _ref10 = _asyncToGenerator(function* (bucketName) {
    try {
      const bucket = getBucket(bucketName);
      const r1 = payload(bucket);
      yield r1.deleteFiles();
      const r3 = yield r1.delete();
      return success(r3);
    } catch (e) {
      return failure(e.toString());
    }
  });

  return function deleteBucket(_x14) {
    return _ref10.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const {
  failure,
  success,
  payload,
  isFailure
} = require('@pheasantplucker/failables-node6');
// const ramda = require('ramda')
const storage = require('@google-cloud/storage')();

const noUpperCase = name => {
  if (name === '' || name === undefined) return false;
  const nameRegex = new RegExp(/[A-Z]/);
  const anyUpperCaseMatch = name.match(nameRegex);
  if (anyUpperCaseMatch === null) return true;
  return false;
};

const createBucket = (() => {
  var _ref = _asyncToGenerator(function* (bucketName) {
    const validName = noUpperCase(bucketName);
    if (!validName) {
      return failure(bucketName, {
        error: 'Bucketname contains upper case illegal characters. | a-z 0-9 - | only'
      });
    }
    try {
      const result = yield storage.createBucket(bucketName);
      const response = result[0];
      if (bucketName !== response.id) {
        return failure('Did not create the bucket', response);
      }
      return success(result, response);
    } catch (e) {
      return failure(e.toString());
    }
  });

  return function createBucket(_x) {
    return _ref.apply(this, arguments);
  };
})();

const bucketExists = (() => {
  var _ref2 = _asyncToGenerator(function* (bucketName) {
    const validName = noUpperCase(bucketName);
    if (!validName) {
      return failure(bucketName, {
        error: 'Bucketname contains upper case, or illegal characters. | a-z 0-9 - | only'
      });
    }
    try {
      const bucket = storage.bucket(bucketName);
      const exists = yield bucket.exists();
      const existsPayload = exists[0];
      return success(existsPayload);
    } catch (e) {
      return failure(e.toString());
    }
  });

  return function bucketExists(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

function getFileHandle(filepath) {
  const { bucketpart, filepart } = split_filename(filepath);
  const bucket = storage.bucket(bucketpart);
  const file = bucket.file(filepart);
  return file;
}

function split_filename(n) {
  const [bucketpart, ...filepartarray] = n.split('/');
  const filepart = filepartarray.join('/');
  return { bucketpart, filepart };
}

const uploadFile = (() => {
  var _ref7 = _asyncToGenerator(function* (bucketName, filePath) {
    try {
      const getThisBucket = yield getBucket(bucketName);
      const thisBucket = payload(getThisBucket);
      const result = yield thisBucket.upload(filePath); //pathString, options, callback
      const response = result[0];
      return success(result, response);
    } catch (e) {
      return failure(e.toString());
    }
  });

  return function uploadFile(_x10, _x11) {
    return _ref7.apply(this, arguments);
  };
})();

const getBucket = bucketName => {
  try {
    const result = storage.bucket(bucketName); //pathString, options, callback
    const response = result[0];
    return success(result, response);
  } catch (e) {
    return failure(e.toString());
  }
};

const newFile = (bucketName, filePath) => {
  const getThisBucket = getBucket(bucketName);
  const thisBucket = payload(getThisBucket);
  const result = thisBucket.file(filePath);
  return success(result);
};

const getFile = (() => {
  var _ref8 = _asyncToGenerator(function* (filePath, opts = {}) {
    const readStreamResult = yield getReadStream(filePath, opts);
    const readStream = payload(readStreamResult);
    return new Promise(function (resolve) {
      let buffer = '';
      readStream.on('data', function (chunk) {
        buffer += chunk;
      });
      readStream.on('end', function () {
        resolve(success(buffer));
      });
    });
  });

  return function getFile(_x12) {
    return _ref8.apply(this, arguments);
  };
})();

module.exports = {
  createBucket,
  bucketExists,
  noUpperCase,
  uploadFile,
  getBucket,
  newFile,
  exists,
  save,
  getReadStream,
  createWriteStream,
  getFile,
  deleteFile,
  deleteBucket
};
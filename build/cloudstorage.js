'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const {
  failure,
  success,
  payload,
  isFailure,
  meta
} = require('@pheasantplucker/failables-node6');
const ramda = require('ramda');
const Storage = require('@google-cloud/storage');

const noUpperCase = name => {
  const nameRegex = new RegExp(/[A-Z]/);
  const anyUpperCaseMatch = name.match(nameRegex);
  if (anyUpperCaseMatch === null) return true;
  return false;
};

let storage;

const createStorageClient = projectId => {
  try {
    const newStorage = new Storage({
      projectId: projectId
    });
    storage = newStorage;
    return success(newStorage);
  } catch (e) {
    return failure(e.toString());
  }
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
    const bucket = storage.bucket(bucketName);

    const exists = yield bucket.exists();
    if (exists) {
      return success(exists);
    }

    return failure(exists, { bucketName: bucketName, bucket: bucket });
  });

  return function bucketExists(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

module.exports = {
  createStorageClient,
  createBucket,
  bucketExists,
  noUpperCase
};
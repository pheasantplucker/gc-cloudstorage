'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const {
  assertSuccess,
  assertFailure
  // payload,
  // isSuccess,
  // isFailure,
} = require(`@pheasantplucker/failables-node6`);
const assert = require('assert');
const equal = assert.deepEqual;
const {
  createStorageClient,
  createBucket,
  bucketExists,
  noUpperCase
} = require('./cloudstorage');

const uuid = require('uuid');

const { GC_PROJECT_ID } = process.env;

describe(`createStorageClient()`, () => {
  it(`should return a client`, () => {
    const result = createStorageClient(GC_PROJECT_ID);
    assertSuccess(result);
  });
});

const bucketName = 'testbucketteer' + uuid.v4();

describe('createBucket()', () => {
  it('should create a bucket IF IT DOES NOT EXIST', _asyncToGenerator(function* () {
    const result = yield createBucket(bucketName);
    assertSuccess(result);
  }));
  it('should return a failure if the name is illegal', _asyncToGenerator(function* () {
    const result = yield createBucket('noUppercasecharactersAllowed');
    assertFailure(result);
  }));
});

describe(`bucketExists()`, () => {
  it(`should return TRUE if a bucket exists`, _asyncToGenerator(function* () {
    const result = yield bucketExists(bucketName);
    assertSuccess(result);
  }));
  it(`should return False if a bucket doesnt exist`, _asyncToGenerator(function* () {
    const randomBucket = 'awduhniou32hbruitb' + uuid.v4();
    const result = yield bucketExists(randomBucket);
    assertFailure(result);
  }));
});

// describe(`deleteFiles(query)`, () => {
// it(`should delete the file in question`, () => {
// const result = deleteFiles(query )
// assertSuccess(result)
// })
// })

describe(`uploadFile(pathString, options, callback)`, () => {
  it(`should upload the test file`, _asyncToGenerator(function* () {
    const testFile = '../test/newFile.txt';
    const result = yield uploadFile(testFile); //, options, callback
    assertSuccess(result);
  }));
});

describe(`noUpperCase()`, () => {
  it(`should return true if there are no upper case, false otherwise`, () => {
    const noUpper = 'adawfgnuiognnuni0nnqnnwdqd';
    const withUpper = 'adawfgnuiognnuniOnnqnnwdqd';
    const result = noUpperCase(noUpper);
    equal(result, true);
    const result2 = noUpperCase(withUpper);
    equal(result2, false);
  });
});
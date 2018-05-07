const {
  assertSuccess,
  assertFailure,
  payload,
  isSuccess,
  isFailure,
  meta,
} = require(`@pheasantplucker/failables`)
const assert = require('assert')
const equal = assert.deepEqual
const { createStorageClient } = require('./cloudstorage')

const { GC_PROJECT_ID } = process.env

describe(`createStorageClient()`, () => {
  it(`should return a client`, () => {
    const result = createStorageClient(GC_PROJECT_ID)
    assertSuccess(result)
  })
})

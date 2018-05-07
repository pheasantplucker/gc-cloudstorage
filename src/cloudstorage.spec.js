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
const {} = require('./cloudstorage')

const { GC_PROJECT_ID } = process.env

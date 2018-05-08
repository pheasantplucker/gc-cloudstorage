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
const {
  createStorageClient,
  createBucket,
  bucketExists,
  noUpperCase,
} = require('./cloudstorage')

const { GC_PROJECT_ID } = process.env

describe(`createStorageClient()`, () => {
  it(`should return a client`, () => {
    const result = createStorageClient(GC_PROJECT_ID)
    assertSuccess(result)
  })
})

const bucketName = 'testbucketter124321433'

describe('createBucket()', () => {
  it('should create a bucket IF IT DOES NOT EXIST', async () => {
    const result = await createBucket(bucketName)
    assertSuccess(result)
  })
  it('should return a failure if the name is illegal', async () => {
    const result = await createBucket('noUppercasecharactersAllowed')
    assertFailure(result)
  })
})

describe(`bucketExists()`, () => {
  it(`should return TRUE if a bucket exists`, async () => {
    const result = await bucketExists(bucketName)
    assertSuccess(result)
  })
  it(`should return False if a bucket doesnt exist`, async () => {
    const result = await bucketExists(
      'awduhniou32hbruihnb12319u5hb1tbR3198trb723287rb325125jj'
    )
    // someone will make the above bucket and THEN PROBLEMS BEGIN
    // replace w/ guid?
    assertFailure(result)
  })
})

describe(`noUpperCase()`, () => {
  it(`should return true if there are no upper case, false otherwise`, () => {
    const noUpper = 'adawfgnuiognnuni0nnqnnwdqd'
    const withUpper = 'adawfgnuiognnuniOnnqnnwdqd'
    const result = noUpperCase(noUpper)
    equal(result, true)
    const result2 = noUpperCase(withUpper)
    equal(result2, false)
  })
})

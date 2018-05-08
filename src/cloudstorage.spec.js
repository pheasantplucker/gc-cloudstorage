const {
  assertSuccess,
  assertFailure,
  // payload,
  // isSuccess,
  // isFailure,
} = require(`@pheasantplucker/failables-node6`)
const assert = require('assert')
const equal = assert.deepEqual
const {
  createStorageClient,
  createBucket,
  bucketExists,
  noUpperCase,
} = require('./cloudstorage')

const uuid = require('uuid')

const { GC_PROJECT_ID } = process.env

describe(`createStorageClient()`, () => {
  it(`should return a client`, () => {
    const result = createStorageClient(GC_PROJECT_ID)
    assertSuccess(result)
  })
})

const bucketName = 'testbucketteer' + uuid.v4()

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
    const randomBucket = 'awduhniou32hbruitb' + uuid.v4()
    const result = await bucketExists(randomBucket)
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

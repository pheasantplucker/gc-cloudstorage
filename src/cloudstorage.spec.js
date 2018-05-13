const {
  assertSuccess,
  assertFailure,
  payload,
  // isSuccess,
  // isFailure,
} = require(`@pheasantplucker/failables-node6`)
const assert = require('assert')
const equal = assert.deepEqual
const {
  createBucket,
  getBucket,
  bucketExists,
  uploadFile,
  noUpperCase,
  newFile,
  exists,
  save,
  getReadStream,
  createWriteStream,
  getFile,
  deleteFile,
  deleteBucket,
} = require('./cloudstorage')

const uuid = require('uuid')
const bucketName = 'testbucketteer' + uuid.v4()
const file_id = uuid.v4()
const data = 'foobar'

describe('createBucket()', function() {
  this.timeout(540 * 1000)
  it('should create a bucket IF IT DOES NOT EXIST', async () => {
    const result = await createBucket(bucketName)
    assertSuccess(result)
  })
  it('should return a failure if the name is illegal', async () => {
    const result = await createBucket('noUppercasecharactersAllowed')
    assertFailure(result)
  })
})

describe('save()', function() {
  this.timeout(540 * 1000)

  it('should save a file', async () => {
    const filepath = `${bucketName}/${file_id}.txt`
    const r1 = await save(filepath, data)
    assertSuccess(r1)
    const r2 = await exists(filepath)
    assertSuccess(r2, true)
  })
})

describe('getFile()', function() {
  this.timeout(540 * 1000)

  it('should get a file', async () => {
    const filepath = `${bucketName}/${file_id}.txt`
    const r1 = await save(filepath, data)
    assertSuccess(r1)
    const r2 = await getFile(filepath)
    assertSuccess(r2)
    const fileData = payload(r2)
    equal(data, fileData)
  })
})

describe('exists()', function() {
  this.timeout(540 * 1000)
  it('should check that a file exists', async () => {
    const filepath = `${bucketName}/${file_id}.txt`
    const result = await exists(filepath)
    assertSuccess(result, true)
  })
  it('should return false if the file does not exist', async () => {
    const bucket_that_does_not_exist = uuid.v4()
    const filepath = `${bucket_that_does_not_exist}/${file_id}.txt`
    const result = await exists(filepath)
    assertSuccess(result, false)
  })
})

describe('getReadStream()', function() {
  this.timeout(540 * 1000)
  it('should return a read stream', async () => {
    const filepath = `${bucketName}/${file_id}.txt`
    const opts = {}
    const result = await getReadStream(filepath, opts)
    assertSuccess(result)
    const stream = payload(result)

    return new Promise(resolve => {
      let buffer = ''
      stream.on('data', chunk => {
        buffer += chunk
      })
      stream.on('end', () => {
        equal(data, buffer)
        resolve()
      })
    })
  })
})

describe('createWriteStream()', function() {
  this.timeout(540 * 1000)
  it('should write data to a file', async () => {
    const filepath = `${bucketName}/${file_id}.txt`
    const writeFilepath = `${bucketName}/${file_id}.2.txt`
    const opts = {}
    const r1 = await createWriteStream(writeFilepath, opts)
    assertSuccess(r1)
    const writeStream = payload(r1)

    const r2 = await getReadStream(filepath, opts)
    assertSuccess(r2)
    const readStream1 = payload(r2)

    return new Promise(resolve => {
      readStream1.pipe(writeStream).on('finish', async () => {
        const r3 = await getFile(writeFilepath)
        const r3Data = payload(r3)
        equal(r3Data, data)
        resolve()
      })
    })
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
    assertSuccess(result, false)
  })
})

describe(`getBucket(bucketName)`, () => {
  it(`should return a bucketObj`, () => {
    const result = getBucket(bucketName)
    assertSuccess(result)
  })
})

describe('deleteFile()', function() {
  this.timeout(540 * 1000)
  it('should delete a file', async () => {
    const filepath = `${bucketName}/${file_id}.txt`
    const r1 = await deleteFile(filepath)
    assertSuccess(r1)
    const r2 = await exists(filepath)
    assertSuccess(r2, false)
  })
})

describe(`newFile()`, () => {
  it(`should return a file object with the path`, () => {
    const fileTest = 'c:/test.txt'
    const result = newFile(bucketName, fileTest)
    assertSuccess(result)
  })
})

describe(`uploadFile()`, () => {
  it(`should upload the test file`, async () => {
    const testFile = './test/newFile.txt'
    const result = await uploadFile(bucketName, testFile) //, options, callback
    assertSuccess(result)
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

describe('deleteBucket()', function() {
  this.timeout(540 * 1000)
  it('should delete a bucket', async () => {
    const r1 = await deleteBucket(bucketName)
    assertSuccess(r1)
    const r2 = await bucketExists(bucketName)
    const bucketExistsData = payload(r2)
    equal(bucketExistsData, false)
    assertSuccess(r2)
  })
})

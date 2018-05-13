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
  createWriteStream
} = require('./cloudstorage')

const uuid = require('uuid')
const bucketName = 'testbucketteer' + uuid.v4()
const file_id = uuid.v4()

describe('createBucket()', function () {
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

describe('save()', function () {
  this.timeout(540 * 1000)
  
  it('should save a file', async () => {
    const filepath = `${bucketName}/${file_id}.txt`
    const data = 'foobar'
    const r1 = await save(filepath, data)
    assertSuccess(r1)
    const r2 = await exists(filepath)
    assertSuccess(r2, true)
  })
})

describe('exists()', function () {
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

describe('getReadStream()', function () {
  this.timeout(540 * 1000)
  it('should return a read stream', async () => {
    const filepath = `${bucketName}/${file_id}.txt`
    const opts = {}
    const result = await getReadStream(filepath, opts)
    assertSuccess(result)
    const stream = payload(result)

    return new Promise((resolve) => {
      let buffer = ''
      stream.on('data', (chunk)=> {
        buffer += chunk
      })
      stream.on('end', ()=> {
        equal('foobar', buffer)
        resolve()
      })
    })
  })
})

describe('createWriteStream()', function () {
  this.timeout(540 * 1000)
  it('should write data to a file', async () => {
    const filepath = `${bucketName}/${file_id}.txt`
    const opts = {}
    const result = await createWriteStream(filepath, opts)
    assertSuccess(result)
    const stream = payload(result)

    return new Promise((resolve) => {
      let buffer = ''
      stream.on('data', (chunk)=> {
        buffer += chunk
      })
      stream.on('end', ()=> {
        equal('foobar', buffer)
        resolve()
      })
    })
  })
})


// describe.skip(`bucketExists()`, () => {
//   it(`should return TRUE if a bucket exists`, async () => {
//     const result = await bucketExists(bucketName)
//     assertSuccess(result)
//   })
//   it(`should return False if a bucket doesnt exist`, async () => {
//     const randomBucket = 'awduhniou32hbruitb' + uuid.v4()
//     const result = await bucketExists(randomBucket)
//     assertFailure(result)
//   })
// })

// describe.skip(`getBucket(bucketName)`, () => {
//   it(`should return a bucketObj`, () => {
//     const result = getBucket(bucketName)
//     assertSuccess(result)
//   })
// })
// describe(`deleteFiles(query)`, () => {
// it(`should delete the file in question`, () => {
// const result = deleteFiles(query )
// assertSuccess(result)
// })
// })

// describe.skip(`newFile()`, () => {
//   it(`should return a file object with the path`, () => {
//     const fileTest = 'c:/test.txt'
//     const result = newFile(bucketName, fileTest)
//     assertSuccess(result)
//   })
// })

// describe.skip(`uploadFile()`, () => {
//   it(`should upload the test file`, async () => {
//     const testFile = './test/newFile.txt'
//     const result = await uploadFile(bucketName, testFile) //, options, callback
//     assertSuccess(result)
//   })
// })

// describe.skip(`noUpperCase()`, () => {
//   it(`should return true if there are no upper case, false otherwise`, () => {
//     const noUpper = 'adawfgnuiognnuni0nnqnnwdqd'
//     const withUpper = 'adawfgnuiognnuniOnnqnnwdqd'
//     const result = noUpperCase(noUpper)
//     equal(result, true)
//     const result2 = noUpperCase(withUpper)
//     equal(result2, false)
//   })
// })

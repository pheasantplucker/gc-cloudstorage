const {
  failure,
  success,
  payload,
  isFailure,
} = require('@pheasantplucker/failables-node6')
// const ramda = require('ramda')
const storage = require('@google-cloud/storage')()

const noUpperCase = name => {
  if (name === '' || name === undefined) return false
  const nameRegex = new RegExp(/[A-Z]/)
  const anyUpperCaseMatch = name.match(nameRegex)
  if (anyUpperCaseMatch === null) return true
  return false
}

const createBucket = async bucketName => {
  const validName = noUpperCase(bucketName)
  if (!validName) {
    return failure(bucketName, {
      error:
        'Bucketname contains upper case illegal characters. | a-z 0-9 - | only',
    })
  }
  try {
    const result = await storage.createBucket(bucketName)
    const response = result[0]
    if (bucketName !== response.id) {
      return failure('Did not create the bucket', response)
    }
    return success(result, response)
  } catch (e) {
    return failure(e.toString())
  }
}

const bucketExists = async bucketName => {
  const validName = noUpperCase(bucketName)
  if (!validName) {
    return failure(bucketName, {
      error:
        'Bucketname contains upper case, or illegal characters. | a-z 0-9 - | only',
    })
  }
  try {
    const bucket = storage.bucket(bucketName)
    const exists = await bucket.exists()
    const existsPayload = exists[0]
    return success(existsPayload)
  } catch (e) {
    return failure(e.toString())
  }
}

async function exists(filename) {
  const { bucketpart } = split_filename(filename)
  try {
    // first check that the bucket exists
    const r1 = bucketExists(bucketpart)
    if (isFailure(r1)) return r1
    if (payload(r1) === false) return success(false)
    const fileHandle = getFileHandle(filename)
    const result = await fileHandle.exists()
    return success(result[0])
  } catch (e) {
    console.log(e.toString())
    return failure(e.toString())
  }
}
async function save(filename, data) {
  try {
    const fileHandle = getFileHandle(filename)
    const result = await fileHandle.save(data)
    return success(result)
  } catch (e) {
    console.log('ERrror: ', JSON.stringify(e))
    return failure(e)
  }
}

async function getReadStream(filename, opts) {
  try {
    const fileHandle = getFileHandle(filename)
    const result = fileHandle.createReadStream()
    return success(result)
  } catch (e) {
    console.log(e.toString())
    return failure(e.toString())
  }
}

async function createWriteStream(filename, opts) {
  try {
    const fileHandle = getFileHandle(filename)
    const result = fileHandle.createWriteStream()
    return success(result)
  } catch (e) {
    console.log(e.toString())
    return failure(e.toString())
  }
}

function getFileHandle(filepath) {
  const { bucketpart, filepart } = split_filename(filepath)
  const bucket = storage.bucket(bucketpart)
  const file = bucket.file(filepart)
  return file
}

function split_filename(n) {
  const [bucketpart, ...filepartarray] = n.split('/')
  const filepart = filepartarray.join('/')
  return { bucketpart, filepart }
}

const uploadFile = async (bucketName, filePath) => {
  try {
    const getThisBucket = await getBucket(bucketName)
    const thisBucket = payload(getThisBucket)
    const result = await thisBucket.upload(filePath) //pathString, options, callback
    const response = result[0]
    return success(result, response)
  } catch (e) {
    return failure(e.toString())
  }
}

const getBucket = bucketName => {
  try {
    const result = storage.bucket(bucketName) //pathString, options, callback
    const response = result[0]
    return success(result, response)
  } catch (e) {
    return failure(e.toString())
  }
}

const newFile = (bucketName, filePath) => {
  const getThisBucket = getBucket(bucketName)
  const thisBucket = payload(getThisBucket)
  const result = thisBucket.file(filePath)
  return success(result)
}

const getFile = async (filePath, opts = {}) => {
  const readStreamResult = await getReadStream(filePath, opts)
  const readStream = payload(readStreamResult)
  return new Promise(resolve => {
    let buffer = ''
    readStream.on('data', chunk => {
      buffer += chunk
    })
    readStream.on('end', () => {
      resolve(success(buffer))
    })
  })
}

async function deleteFile(filename) {
  try {
    const fileHandle = getFileHandle(filename)
    const result = await fileHandle.delete()
    return success(result)
  } catch (e) {
    console.log('Error: ', JSON.stringify(e))
    return failure(e)
  }
}

async function deleteBucket(bucketName) {
  try {
    const bucket = getBucket(bucketName)
    const r1 = payload(bucket)
    await r1.deleteFiles()
    const r3 = await r1.delete()
    return success(r3)
  } catch (e) {
    console.log('Error: ', JSON.stringify(e))
    return failure(e)
  }
}

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
  deleteBucket,
}

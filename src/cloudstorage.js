const {
  failure,
  success,
  payload,
  isFailure,
  meta,
} = require('@pheasantplucker/failables')
const ramda = require('ramda')
const Storage = require('@google-cloud/storage')

const noUpperCase = name => {
  const nameRegex = new RegExp(/[A-Z]/)
  const anyUpperCaseMatch = name.match(nameRegex)
  if (anyUpperCaseMatch === null) return true
  return false
}

let storage

const createStorageClient = projectId => {
  try {
    const newStorage = new Storage({
      projectId: projectId,
    })
    storage = newStorage
    return success(newStorage)
  } catch (e) {
    return failure(e.toString())
  }
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
  const bucket = storage.bucket(bucketName)

  const exists = await bucket.exists()
  if (exists) {
    return success(exists)
  }

  return failure(exists, { bucketName: bucketName, bucket: bucket })
}

module.exports = {
  createStorageClient,
  createBucket,
  bucketExists,
  noUpperCase,
}

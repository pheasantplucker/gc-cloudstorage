const {
  failure,
  success,
  payload,
  isFailure,
  meta,
} = require('@pheasantplucker/failables')
const ramda = require('ramda')
const Storage = require('@google-cloud/storage')

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

module.exports = { createStorageClient }

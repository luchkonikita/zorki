import { test } from 'ava'
import * as path from 'path'
import * as sinon from 'sinon'

import { localObject, remoteObject } from '../../test/fixtures'
import AWS from '../_vendor/AWS'
import Config from '../config'
import RemoteStorage from '.'

const stubS3Call = (dataToReturn?: any) => {
  return sinon.stub().callsFake((options, callback) => callback(null, dataToReturn))
}

test.beforeEach(t => {
  const listObjectsResult = {
    Contents: [remoteObject]
  }
  t.context.S3Spy = {
    listObjects: stubS3Call(listObjectsResult),
    getObject: stubS3Call(remoteObject),
    putObject: stubS3Call(remoteObject),
    deleteObjects: stubS3Call()
  }
  t.context.initS3Spy = sinon.stub(AWS, 'initS3').returns(t.context.S3Spy)

  t.context.config = new Config({
    config: path.join(process.cwd(), 'test/config.test.json')
  })

  t.context.storage = new RemoteStorage(t.context.config)
})

test.afterEach.always(t => {
  t.context.initS3Spy.restore()
})

test.serial('initializes S3 with credentials', t => {
  t.true(t.context.initS3Spy.calledWith({
    accessKeyId: 'TEST_ID',
    secretAccessKey: 'TEST_KEY'
  }))
})

test.serial('cleans up the remote storage bucket', async t => {
  await t.context.storage.cleanup()

  t.true(t.context.S3Spy.listObjects.calledWith({
    Bucket: 'TEST_BUCKET'
  }))
  t.true(t.context.S3Spy.deleteObjects.calledWith({
    Bucket: 'TEST_BUCKET',
    Delete: {Objects: [{Key: 'OBJECT_KEY'}]}
  }))
})

test.serial('downloads an item and returns content', async t => {
  const result = await t.context.storage.download(localObject)

  t.is(result.toString(), 'OBJECT_BODY')
})

test.serial('uploads an item and returns content', async t => {
  const result = await t.context.storage.upload(localObject)

  t.is(result.toString(), 'SCREENSHOT')
})

import { test } from 'ava'
import * as path from 'path'
import Config from '.'

test.beforeEach(t => {
  t.context.config = new Config({
    config: path.join(process.cwd(), 'test/config.test.json')
  })
})

test('has urls', t => {
  t.deepEqual(t.context.config.urls, ['http://localhost:3001'])
})

test('has screenWidths', t => {
  t.deepEqual(t.context.config.screenWidths, [1440, 1920])
})

test('has storeDir', t => {
  t.is(t.context.config.storeDir, './tmp/test')
})

test('has screenshotsDir', t => {
  t.is(t.context.config.screenshotsDir, 'tmp/test/screenshots')
})

test('has baselinesDir', t => {
  t.is(t.context.config.baselinesDir, 'tmp/test/baselines')
})

test('has diffsDir', t => {
  t.is(t.context.config.diffsDir, 'tmp/test/diffs')
})

test('has s3Credentials', t => {
  t.deepEqual(t.context.config.s3Credentials, {
    accessKeyId: 'TEST_ID',
    secretAccessKey: 'TEST_KEY'
  })
})

test('has bucketName', t => {
  t.is(t.context.config.bucketName, 'TEST_BUCKET')
})

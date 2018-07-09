import { test } from 'ava'
import * as fs from 'fs'
import * as path from 'path'
import Config from '../config'
import Data from '.'

test.beforeEach(t => {
  const config = new Config({
    config: path.join(process.cwd(), 'test/config.test.json')
  })
  t.context.data = new Data(config)
})

test('collects screenshots data', t => {
  const {screenshots} = t.context.data
  t.is(screenshots.length, 2)

  t.deepEqual(screenshots[0], {
    url: 'http://localhost:3001',
    width: 1440,
    filename: 'aHR0cDovL2xvY2FsaG9zdDozMDAxQDE0NDA=.png',
    screenshotPath: 'tmp/test/screenshots/aHR0cDovL2xvY2FsaG9zdDozMDAxQDE0NDA=.png',
    baselinePath: 'tmp/test/baselines/aHR0cDovL2xvY2FsaG9zdDozMDAxQDE0NDA=.png',
    diffPath: 'tmp/test/diffs/aHR0cDovL2xvY2FsaG9zdDozMDAxQDE0NDA=.png'
  })

  t.deepEqual(screenshots[1], {
    url: 'http://localhost:3001',
    width: 1920,
    filename: 'aHR0cDovL2xvY2FsaG9zdDozMDAxQDE5MjA=.png',
    screenshotPath: 'tmp/test/screenshots/aHR0cDovL2xvY2FsaG9zdDozMDAxQDE5MjA=.png',
    baselinePath: 'tmp/test/baselines/aHR0cDovL2xvY2FsaG9zdDozMDAxQDE5MjA=.png',
    diffPath: 'tmp/test/diffs/aHR0cDovL2xvY2FsaG9zdDozMDAxQDE5MjA=.png'
  })
})

test('prepares directories structure', async t => {
  const dirs = ['tmp/test/screenshots', 'tmp/test/baselines', 'tmp/test/diffs']

  dirs.forEach(dir => t.false(fs.existsSync(dir)))
  await t.context.data.prepare()
  dirs.forEach(dir => t.true(fs.existsSync(dir)))
})

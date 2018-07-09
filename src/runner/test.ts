import { test } from 'ava'
import * as sinon from 'sinon'

import puppeteer from '../_vendor/puppeteer'
import { localObject } from '../../test/fixtures'
import Runner from '.'

test.beforeEach(t => {
  t.context.pageMock = {
    setViewport: sinon.stub().returns(Promise.resolve()),
    goto: sinon.stub().returns(Promise.resolve()),
    screenshot: sinon.stub().returns(Promise.resolve())
  }

  t.context.browserMock = {
    newPage: sinon.stub().returns(Promise.resolve(t.context.pageMock)),
    close: sinon.stub().returns(Promise.resolve())
  }

  t.context.launchPuppeteerSpy = sinon.stub(puppeteer, 'launchPuppeteer')
    .returns(Promise.resolve(t.context.browserMock))

  t.context.logger = {
    info: () => { /* Do nothing */ },
    ask: () => Promise.resolve(true)
  }

  t.context.data = {
    screenshots: [localObject],
    prepare: () => Promise.resolve()
  }

  t.context.runner = new Runner(t.context.logger, t.context.data)
})

test.afterEach.always(t => {
  t.context.launchPuppeteerSpy.restore()
})

test.serial('starts browser and opens the page', async t => {
  await t.context.runner.start()

  t.true(t.context.launchPuppeteerSpy.called)
  t.true(t.context.browserMock.newPage.called)
})

test.serial('stops browser', async t => {
  await t.context.runner.start()
  await t.context.runner.stop()

  t.true(t.context.browserMock.close.called)
})

test.serial('makes screenshots', async t => {
  await t.context.runner.start()
  await t.context.runner.run()

  t.true(t.context.pageMock.setViewport.calledWith({ width: 1280, height: 600 }))
  t.true(t.context.pageMock.goto.calledWith('URL', { timeout: 60000 }))
  t.true(t.context.pageMock.screenshot.calledWith({ path: 'test/fixtures/screenshot', fullPage: true }))
})

import * as puppeteer from 'puppeteer'
import localPuppeteer from '../_vendor/puppeteer'

const DEFAULT_HEIGHT = 600

export default class Runner {
  private logger: ILogger
  private data: IData
  private browser: puppeteer.Browser
  private page: puppeteer.Page

  constructor(logger: ILogger, data: IData) {
    this.logger = logger
    this.data = data
  }

  async start() {
    this.logger.info('   Starting browser')
    this.browser = await localPuppeteer.launchPuppeteer()
    this.page = await this.browser.newPage()
  }

  async stop() {
    this.logger.info('   Stoping browser')
    await this.browser.close()
  }

  async run() {
    for (const screenshot of this.data.screenshots) {
      await this.makeScreenshot(screenshot.url, screenshot.screenshotPath, screenshot.width)
    }
  }

  private async makeScreenshot(url: string, storePath: string, width = 1280, retries = 3) {
    try {
      this.logger.info(`   Checking ${url} at ${width}px`)
      await this.page.setViewport({width, height: DEFAULT_HEIGHT})
      await this.page.goto(url, {timeout: 60000})
      await this.page.screenshot({ path: storePath, fullPage: true })
    } catch (error) {
      const retriesLast = retries - 1
      if (retriesLast > 0) {
        await this.makeScreenshot(url, storePath, width, retriesLast)
      } else {
        this.logger.info(`   Could not get the screenshot for ${url} at ${width}px`)
      }
    }
  }
}

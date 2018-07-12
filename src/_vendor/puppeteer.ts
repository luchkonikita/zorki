import * as puppeteer from 'puppeteer'

const envOpts: {
  executablePath?: string
} = {}

if (process.env.CHROME_PATH) envOpts.executablePath = process.env.CHROME_PATH

export default {
  launchPuppeteer(opts?) {
    return puppeteer.launch({...envOpts, ...opts})
  }
}

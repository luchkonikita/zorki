import * as puppeteer from 'puppeteer'

export default {
  launchPuppeteer(opts?) {
    return puppeteer.launch(opts)
  }
}

import * as path from 'path'
import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import * as rimraf from 'rimraf'

import Config from '../config'

function urlToFilename(url: string) {
  return new Buffer(url).toString('base64') + '.png'
}

export default class Data implements IData {
  private cachedScreenshots?: IScreenshotData[]
  private config: Config

  constructor(config: Config) {
    this.config = config
  }

  get screenshots(): IScreenshotData[] {
    if (this.cachedScreenshots) return this.cachedScreenshots

    const data: IScreenshotData[] = []
    this.config.urls.forEach(url => {
      this.config.screenWidths.forEach(width => {
        const filename = urlToFilename([url, width].join('@'))
        const screenshotPath = path.join(this.config.screenshotsDir, filename)
        const baselinePath = path.join(this.config.baselinesDir, filename)
        const diffPath = path.join(this.config.diffsDir, filename)
        data.push({url, width, filename, screenshotPath, baselinePath, diffPath})
      })
    })
    this.cachedScreenshots = data
    return this.cachedScreenshots
  }

  async prepare() {
    if (!fs.existsSync(this.config.storeDir)) mkdirp.sync(this.config.storeDir)
    const dirs = [this.config.screenshotsDir, this.config.baselinesDir, this.config.diffsDir]

    for (const dir of dirs) {
      await new Promise((resolve, reject) => rimraf(dir, error => error ? reject(error) : resolve()))
      fs.mkdirSync(dir)
    }
  }
}

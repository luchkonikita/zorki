import * as looksSame from 'looks-same'
import * as path from 'path'

import RemoteStorage from '../../remote_storage'
import Stage from '..'

const TOLERANCE = 6

export default class BaselinesPresenceChecker extends Stage {
  async perform() {
    for (const screenshot of this.data.screenshots) {
      // TODO: Handle a case when baseline is somehow missing...

      const isEqual = await this.compareScreenshot(screenshot)

      if (!isEqual) {
        await this.writeDiff(screenshot)
        const shouldUpload = await this.confirmUpload(screenshot)

        if (shouldUpload) {
          const storage = new RemoteStorage(this.config)
          await storage.upload(screenshot)
        }
      }
    }
  }

  private compareScreenshot(screenshot: IScreenshotData): Promise<boolean> {
    return new Promise((resolve, reject) => {
      looksSame(
        screenshot.screenshotPath,
        screenshot.baselinePath,
        { tolerance: TOLERANCE },
        (err, equal) => err ? reject(err) : resolve(equal))
    })
  }

  private async writeDiff(screenshot: IScreenshotData) {
    return new Promise((resolve, reject) => {
      looksSame.createDiff({
        reference: path.join(process.cwd(), screenshot.baselinePath),
        current: path.join(process.cwd(), screenshot.screenshotPath),
        diff: path.join(process.cwd(), screenshot.diffPath),
        highlightColor: '#ff00ff',
        tolerance: TOLERANCE
      }, (err) => {
        err ? reject(err) : resolve()
      })
    })
  }

  private async confirmUpload(screenshot: IScreenshotData): Promise<boolean> {
    const diffFullpath = path.join(process.cwd(), screenshot.diffPath)
    this.logger.info(`   Detected regression for ${screenshot.url} at ${screenshot.width}px:`, 'yellow')
    this.logger.info('   The diff image can be viewed at:', 'gray')
    this.logger.info(`   ${diffFullpath}`, 'gray')

    return this.logger.ask('   Do you want to upload a new one? y/n')
  }
}

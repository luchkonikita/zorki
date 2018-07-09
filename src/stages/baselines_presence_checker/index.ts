import * as fs from 'fs'
import * as path from 'path'
import RemoteStorage from '../../remote_storage'
import Stage from '..'

export default class BaselinesPresenceChecker extends Stage {
  async perform() {
    const storage = new RemoteStorage(this.config)

    for (const screenshot of this.data.screenshots) {
      try {
        const content = await storage.download(screenshot)
        fs.writeFileSync(screenshot.baselinePath, content)
      } catch (error) {
        const shouldUpload = await this.confirmUpload(screenshot)

        if (shouldUpload) {
          const content = await storage.upload(screenshot)
          fs.writeFileSync(screenshot.baselinePath, content)
        }
      }
    }
  }

  private async confirmUpload(screenshot: IScreenshotData): Promise<boolean> {
    const screenshotFullpath = path.join(process.cwd(), screenshot.screenshotPath)

    this.logger.info(`   The baseline image for ${screenshot.url} at ${screenshot.width}px is missing.`, 'yellow')
    this.logger.info('   The current image can be viewed at:', 'gray')
    this.logger.info(`   ${screenshotFullpath}`, 'gray')

    return this.logger.ask('   Do you want to upload a current one? y/n')
  }
}

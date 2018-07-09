import * as fs from 'fs'
import * as path from 'path'
import RemoteStorage from '../../remote_storage'
import Stage from '..'

export default class BaselinesPresenter extends Stage {
  async perform() {
    const storage = new RemoteStorage(this.config)

    for (const screenshot of this.data.screenshots) {
      try {
        const content = await storage.download(screenshot)
        fs.writeFileSync(screenshot.baselinePath, content)
        const baselineFullpath = path.join(process.cwd(), screenshot.baselinePath)

        this.logger.info(`   Baseline for ${screenshot.url} at ${screenshot.width}`, 'yellow')
        this.logger.info(`   ${baselineFullpath}`, 'gray')
      } catch (error) {
        this.logger.info(`   Missing baseline image for ${screenshot.url} at ${screenshot.width}`, 'red')
      }
    }
  }
}

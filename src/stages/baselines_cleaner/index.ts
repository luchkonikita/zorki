import RemoteStorage from '../../remote_storage'
import Stage from '..'

export default class BaselinesCleaner extends Stage {
  async perform() {
    const storage = new RemoteStorage(this.config)
    const shouldCleanup = await this.confirmCleanup()

    if (shouldCleanup) await storage.cleanup()
  }

  private async confirmCleanup(): Promise<boolean> {
    this.logger.info('   This will delete all previously stored baseline images.', 'yellow')

    return this.logger.ask('   Do you want to proceed? y/n')
  }
}

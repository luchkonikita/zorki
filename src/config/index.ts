import * as path from 'path'
import * as fs from 'fs'

export default class Config {
  private config: {
    urls: string[],
    storeDir: string,
    screenWidths: number[],
    accessKeyId: string,
    secretAccessKey: string,
    bucket: string
  }

  constructor(argv: any) {
    const configFileName = argv.config

    this.config = {
      storeDir: 'tmp',
      screenWidths: [1280],
      ...JSON.parse(fs.readFileSync(configFileName).toString())
    }
  }

  get urls() {
    return this.config.urls
  }

  get storeDir() {
    return this.config.storeDir
  }

  get screenWidths() {
    return this.config.screenWidths
  }

  get screenshotsDir() {
    return path.join(this.config.storeDir, 'screenshots')
  }

  get baselinesDir() {
    return path.join(this.config.storeDir, 'baselines')
  }

  get diffsDir() {
    return path.join(this.config.storeDir, 'diffs')
  }

  get s3Credentials() {
    return {
      accessKeyId: this.config.accessKeyId,
      secretAccessKey: this.config.secretAccessKey
    }
  }

  get bucketName() {
    return this.config.bucket
  }
}

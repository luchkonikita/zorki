import * as fs from 'fs'
import AWS from '../_vendor/AWS'
import { S3 } from 'aws-sdk'
import Config from './../config'

export default class RemoteStorage {
  private config: Config
  private s3: S3

  constructor(config: Config) {
    this.config = config
    this.s3 = AWS.initS3(this.config.s3Credentials)
  }

  async cleanup() {
    const keys = await this.getRemoteKeys()

    const options = {
      Bucket: this.config.bucketName,
      Delete: {
        Objects: keys.map(k => ({Key: k}))
      }
    }

    return new Promise((resolve, reject) => {
      this.s3.deleteObjects(options, err => err ? reject(err) : resolve())
    })
  }

  download(screenshot: IScreenshotData): Promise<Buffer> {
    const options = {
      Bucket: this.config.bucketName,
      Key: screenshot.filename
    }

    return new Promise((resolve, reject) => {
      this.s3.getObject(options, (err, data) => err ? reject(err) : resolve(data.Body as Buffer))
    })
  }

  upload(screenshot: IScreenshotData): Promise<Buffer> {
    const contents = fs.readFileSync(screenshot.screenshotPath)
    const putOptions = {
      Bucket: this.config.bucketName,
      Key: screenshot.filename,
      Body: contents,
      ContentType: 'image/png'
    }
    return new Promise((resolve, reject) => {
      this.s3.putObject(putOptions, err => err ? reject(err) : resolve(contents))
    })
  }

  private getRemoteKeys(): Promise<string[]> {
    const options = {
      Bucket: this.config.bucketName
    }

    return new Promise((resolve, reject) => {
      this.s3.listObjects(options, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        const keys = data.Contents ? data.Contents.map(i => i.Key as string) : []
        resolve(keys)
      })
    })
  }
}

import * as OriginalAWS from 'aws-sdk'

export default {
  initS3(opts) {
    return new OriginalAWS.S3(opts)
  }
}

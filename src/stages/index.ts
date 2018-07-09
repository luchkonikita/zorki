import Config from './../config'
import Logger from './../logger'
import Data from '../data'

export default class Stage {
  protected config: Config
  protected data: Data
  protected logger: Logger

  constructor(config: Config, logger: Logger, data: Data) {
    this.config = config
    this.logger = logger
    this.data = data
  }
}

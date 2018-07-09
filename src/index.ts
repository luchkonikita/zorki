#!/usr/bin/env node

import * as yargs from 'yargs'
import Config from './config'
import Data from './data'
import Runner from './runner'
import BaselinesCleaner from './stages/baselines_cleaner'
import BaselinesPresenceChecker from './stages/baselines_presence_checker'
import BaselinesPresenter from './stages/baselines_presenter'
import ScreenshotsMatchChecker from './stages/screenshots_match_checker'
import Logger from './logger'

const syntax = '$0 [action] [options]'
const description = 'Run a screenshot testing suite based on a headless Google Chrome'

const {argv} = yargs.command(syntax, description, (y: yargs.Argv) => {
  y.positional('action', {
    describe: 'command to run',
    type: 'string'
  })

  y.options({
    c: {
      alias: 'config',
      demandOption: true,
      describe: 'the configuration file',
      type: 'string'
    }
  })

  return y
})

const config = new Config(argv)
const data = new Data(config)
const logger = new Logger()
const runner = new Runner(logger, data)

async function run() {
  // Clean directories
  logger.info('1. Preparing directories', 'blue')
  await data.prepare()

  // Make screenshots
  logger.info('2. Making screenshots', 'blue')
  await runner.start()
  await runner.run()
  await runner.stop()

  // Compare with baseline images
  logger.info('3. Looking up for baseline screenshots', 'blue')
  await new BaselinesPresenceChecker(config, logger, data).perform()

  logger.info('4. Comparing screenshots', 'blue')
  await new ScreenshotsMatchChecker(config, logger, data).perform()

  logger.info('   All done!', 'green')
}

async function cleanup() {
  // Clean remote storage
  logger.info('1. Cleaning up baseline images stored in AWS S3 bucket', 'blue')
  await new BaselinesCleaner(config, logger, data).perform()

  logger.info('   All done!', 'green')
}

async function list() {
  // Clean remote storage
  logger.info('1. Downloading baseline images', 'blue')
  await new BaselinesPresenter(config, logger, data).perform()

  logger.info('   All done!', 'green')
}

async function warn() {
  new Logger().info('Unrecognized command... Exiting', 'red')
}

process.on('SIGINT', async () => {
  new Logger().info('Interrupted... Cleaning up and exiting', 'red')
  await runner.stop()
  process.exit()
})

const command = {run, cleanup, list}[argv.action] || warn

command()
  .then(async () => {
    await runner.stop()
    process.exit()
  })
  .catch(async (err) => {
    await runner.stop()
    new Logger().info(err.message, 'red')
    process.exit()
  })

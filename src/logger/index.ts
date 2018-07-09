import * as chalk from 'chalk'
import * as promptly from 'promptly'

export default class Logger implements ILogger {
  info(text: string, color = 'white') {
    // tslint:disable-next-line no-console
    console.log(chalk[color](text))
  }

  async ask(text: string, color = 'white') {
    const answer: string = await promptly.prompt(chalk[color].bold(text))
    return answer === 'y'
  }
}

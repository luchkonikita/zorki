interface IScreenshotData {
  url: string
  width: number
  filename: string
  screenshotPath: string
  baselinePath: string
  diffPath: string
}

interface ILogger {
  info(text: string, color?: string): void
  ask(text: string, color?: string): Promise<boolean>
}

interface IData {
  screenshots: IScreenshotData[]
  prepare(): Promise<void>
}
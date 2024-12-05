import { resolve } from 'node:path'

export * from './android-platform-tools/index.js'

export * from './gnirehtet/index.js'

export * from './logo/index.js'

export * from './scrcpy/index.js'

export * from './tray/index.js'

export const desktopPath = process.env.DESKTOP_PATH

export const devPublishPath = resolve('dev-publish.yml')

export const logPath = process.env.LOG_PATH

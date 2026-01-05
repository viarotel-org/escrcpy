import { resolve } from 'node:path'

export * from './extra/index.js'
export * from './logo/index.js'
export * from './which/index.js'

export const desktopPath = process.env.DESKTOP_PATH

export const devPublishPath = resolve('dev-publish.yml')

export const logPath = process.env.LOG_PATH

export const browserWindowWidth = 800

export const browserWindowHeight = Number((browserWindowWidth / 1.57).toFixed())

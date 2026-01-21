import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'

/**
 * Setup Electron portable mode by redirecting data directories
 */
export function setupPortableMode() {
  if (process.platform !== 'win32') {
    return false
  }

  const portableDir = process.env.PORTABLE_EXECUTABLE_DIR

  if (!portableDir) {
    return false
  }

  const dataRoot = path.resolve(portableDir, 'Data')

  const paths = {
    userData: path.join(dataRoot, 'profile'),
    sessionData: path.join(dataRoot, 'session'),
    cache: path.join(dataRoot, 'cache'),
    logs: path.join(dataRoot, 'logs'),
  }

  for (const dir of Object.values(paths)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  for (const [key, value] of Object.entries(paths)) {
    app.setPath(key, value)
  }

  return true
}

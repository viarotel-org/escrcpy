import { extraResolve } from '$root/electron/process/resources.js'
import createDesktopShortcuts from 'create-desktop-shortcuts'
import adb from '$electron/middleware/adb/index.js'
import { createAppIcon } from './app-icon.js'
import os from 'node:os'
import path from 'node:path'

function buildShortcuts(options = {}) {
  const desktopShortcuts = createDesktopShortcuts({
    windows: {
      ...options,
      VBScriptPath: extraResolve('win/vbs/create-desktop-shortcuts.vbs'),
      filePath: process.execPath,
    },
    linux: {
      ...options,
      chmod: true,
      filePath: process.execPath,
    },
  })

  return desktopShortcuts
}

export default {
  createShortcuts(options = {}) {
    return buildShortcuts(options)
  },

  /**
   * Creates a desktop shortcut for launching an Android app, with the
   * shortcut icon set to the app's real launcher icon (extracted from the
   * APK on the device). Falls back to the default application icon when the
   * icon cannot be extracted.
   */
  async createAppShortcuts(options = {}) {
    const { id, packageName } = options

    if (id && packageName) {
      const iconPath = await createAppIcon({
        adb,
        id,
        packageName,
        cacheDir: path.join(os.tmpdir(), 'escrcpy', 'app-icons'),
      })

      if (iconPath) {
        options = { ...options, icon: iconPath }
      }
    }

    return buildShortcuts(options)
  },
}

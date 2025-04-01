import createDesktopShortcuts from 'create-desktop-shortcuts'
import { extraResolve } from '$root/electron/helpers'

export default {
  createShortcuts(options = {}) {
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
  },
}

/**
 * Context menu service - Initialize electron-context-menu for right-click menu support.
 *
 * This service sets up context menu configuration for the application,
 * customizing which options appear in right-click menus across the app.
 */

import contextMenu from 'electron-context-menu'
import { isPackaged } from '$electron/helpers/index.js'

export default (appContext) => {
  try {
    contextMenu({
      // Hide image copy option
      showCopyImage: false,

      // Hide text selection option
      showSelectAll: false,

      // Hide Google search option
      showSearchWithGoogle: false,

      // Show save image option
      showSaveImageAs: true,

      // Show inspect element in dev mode only
      showInspectElement: !isPackaged(),
    })

    appContext?.emit?.('context-menu:initialized')
    return { initialized: true }
  }
  catch (error) {
    console.error('[service:context-menu] Failed to initialize context menu:', error)
    appContext?.emit?.('context-menu:error', error)
    return { initialized: false, error }
  }
}

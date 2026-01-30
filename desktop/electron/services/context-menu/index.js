import contextMenu from 'electron-context-menu'
import { isPackaged } from '$electron/helpers/index.js'

export default {
  name: 'service:context-menu',
  apply() {
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

      return { initialized: true }
    }
    catch (error) {
      console.error('[service:context-menu] Failed to initialize context menu:', error)
      return { initialized: false, error }
    }
  },
}

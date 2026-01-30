import electronStore from '$electron/helpers/store/index.js'
import { Edger } from './helper.js'
import { resolveMainWindow } from '@escrcpy/electron-modularity/main'

export default {
  name: 'service:edger',
  async apply(app) {
    if (!electronStore.get('common.edgeHidden')) {
      return false
    }

    const mainWindow = await resolveMainWindow(app)

    if (!mainWindow) {
      console.warn('[edger] main window not available')
      return false
    }

    // Initialize Edger if edgeHidden is enabled in settings
    try {
      new Edger(mainWindow)
    }
    catch (error) {
      console.warn('[edger] Edger initialization failed:', error?.message || error)
    }
  },
}

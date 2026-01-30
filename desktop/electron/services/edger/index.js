import electronStore from '$electron/helpers/store/index.js'
import { Edger } from './helper.js'
import { resolveMainWindow } from '@escrcpy/electron-modularity/main'

export default {
  name: 'service:edger',
  async apply(appContext) {
    const mainWindow = await resolveMainWindow(appContext)

    if (!mainWindow) {
      console.warn('[edger] main window not available')
      return
    }

    // Initialize Edger if edgeHidden is enabled in settings
    if (electronStore.get('common.edgeHidden')) {
      try {
        new Edger(mainWindow)
        console.log('[edger] Edger initialized successfully')
      }
      catch (error) {
        console.warn('[edger] Edger initialization failed:', error?.message || error)
      }
    }
  },
}

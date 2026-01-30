/**
 * @escrcpy/electron-modularity
 *
 * Modular Electron application architecture with unctx-powered plugin system
 *
 * @example
 * ```ts
 * import { createElectronApp, createWindowManager } from '@escrcpy/electron-modularity'
 *
 * const ctx = createElectronApp({
 *   name: 'MyApp',
 *   preloadDir: __dirname,
 *   rendererDir: path.join(__dirname, '../dist'),
 * })
 *
 * const windowManager = createWindowManager('main', {
 *   singleton: true,
 *   mainWindow: true,
 *   browserWindow: {
 *     width: 1200,
 *     height: 800,
 *   },
 *   hooks: {
 *     created(win, ctx) {
 *       console.log('Main window created', win.id)
 *     }
 *   }
 * })
 *
 * ctx.use(myPlugin)
 * ctx.start()
 * ```
 */

export { createDefaultStorage, ElectronStoreAdapter } from '../shared/adapters/storage-adapter'

// Helpers
export { loadPage, resolveMainWindow } from '../shared/helpers'

// Storage interface and adapters
export type { IStorage } from '../shared/interfaces'
// Browser window template
export { createBrowserWindow, TemplateBrowserWindow } from '../shared/template'

// Core app and plugin system
export { createElectronApp, useElectronApp } from './app'

// Type exports
export type * from './types'

// Window manager
export { createWindowManager, useWindowContext } from './window'

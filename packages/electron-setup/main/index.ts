/**
 * @escrcpy/electron-setup
 *
 * A modular setup and runtime framework for Electron with plugins, window management, and contextual dependency injection.
 *
 * @example
 * ```ts
 * import { createElectronApp, createWindowManager } from '@escrcpy/electron-setup'
 *
 * const mainApp = createElectronApp({
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
 *     created(win, mainApp) {
 *       console.log('Main window created', win.id)
 *     }
 *   }
 * })
 *
 * mainApp.use(myPlugin)
 * mainApp.start()
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

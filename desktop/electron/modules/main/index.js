import { BrowserWindow, app as electronApp } from 'electron'
import remote from '@electron/remote/main'












































































































































































































































































































































































































建议优先采用 `app.registerMainWindow()` + `app.getMainWindow()` 的方式,这是最简单且最符合单一职责原则的方案。- ✅ **渐进迁移** - 可以按模块逐步采用新 API- ✅ **灵活配置** - 支持多种主窗口解析策略- ✅ **解耦依赖** - 移除硬编码的业务层约定- ✅ **类型安全** - 消除 `as any` 断言- ✅ **零破坏性变更** - 所有现有代码继续工作本次重构在保持完全向后兼容的同时,提供了更清晰的架构边界和更完善的类型系统:## 总结```})  mainWindowProvider: () => app.getMainWindow()app.use(singletonPlugin, {// 方式 2: 提供自定义解析器app.registerMainWindow(win)// 方式 1: 注册主窗口```typescript**解决**:**原因**: 没有注册主窗口或提供 `mainWindowProvider`### 问题 3: singleton 插件找不到主窗口**解决**: 更新到最新版本**原因**: 使用了旧版本的 `electron-modularity`### 问题 2: `app.registerMainWindow is not a function````const manager = createWindowManager<any, EnhancedBrowserWindow>('main', { ... })// 方式 2: 使用泛型const win: EnhancedBrowserWindow = createBrowserWindow({ ... })// 方式 1: 显式类型标注```typescript**解决**:**原因**: 没有使用 `EnhancedBrowserWindow` 类型### 问题 1: TypeScript 提示 `loadPage` 不存在## 故障排查```app.use(singletonPlugin, { mainWindowId: 'main' })// 4. 在 singleton 中硬编码 mainWindowIdconst id = (win as any).__instanceId// 3. 使用 as any 断言app.emit('window:main:ready', win)// 2. 硬编码事件名app.provide('modules:main', win)// 1. 硬编码依赖注入键```typescript### ❌ 不推荐 (但仍然可用)```}  }    win.loadPage('main')  // 类型安全    console.log(win.__instanceId)  // 类型安全  created(win, ctx) {hooks: {// 4. 在 hooks 中享受类型安全const manager = createWindowManager<Payload, MyWindow>('main', { ... })type MyWindow = EnhancedBrowserWindow<{ customId: string }>// 3. 为自定义窗口定义类型const mainWindow = app.getMainWindow()// 2. 使用 getMainWindow 获取主窗口app.registerMainWindow(win)// 1. 使用 registerMainWindow 注册主窗口```typescript### ✅ 推荐## 最佳实践```}  // ...  ready?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>  created?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>export interface WindowHooks<TPayload = unknown, TWindow extends BrowserWindow = BrowserWindow> {// 窗口钩子 (支持泛型窗口类型)}  // ...  getAll(): TWindow[]  get(instanceId?: string): TWindow | undefined  open(payload?: TPayload): Promise<TWindow | null>  create(payload?: TPayload): Promise<TWindow | null>export interface WindowManager<TPayload = unknown, TWindow extends BrowserWindow = BrowserWindow> {// 窗口管理器 (支持泛型窗口类型)export type MainWindowProvider = () => BrowserWindow | undefined | Promise<BrowserWindow | undefined>// 主窗口提供者export type MainWindowResolver = (app?: ElectronApp) => Promise<BrowserWindow | undefined>// 主窗口解析器}  customId?: string  __instanceId?: string  __managerId?: string  loadPage(pagePath?: string, query?: Record<string, any>): void  readonly raw: BrowserWindowexport interface EnhancedBrowserWindow<TExtensions = object> extends BrowserWindow {// 增强的浏览器窗口```typescript## 类型定义参考4. **第四步**: 移除旧的 `app.provide('modules:main')` 和事件触发3. **第三步**: 为 `WindowManager` 添加泛型类型参数2. **第二步**: 将 `resolveMainWindow` 的调用改为 `app.getMainWindow()`1. **第一步**: 在主窗口 `created` 钩子中添加 `app.registerMainWindow(win)`你可以按窗口逐步迁移:### 渐进式迁移✅ 所有现有的钩子签名保持不变✅ `singletonPlugin` 的 `mainWindowId` 选项仍然支持  ✅ `WindowManager` 默认返回 `BrowserWindow` 类型  ✅ `resolveMainWindow()` 支持旧的 `inject('modules:main')` 和 `'window:main:ready'` 事件  所有现有代码无需修改即可继续工作:### 向后兼容## 兼容性保证```}  mainWindow?.webContents.send('update-available')  const mainWindow = await resolveMainWindow(app)async function updateService() {import { resolveMainWindow } from '@escrcpy/electron-modularity/main'// 在服务中使用app.start()})  mainWindowProvider: () => app.getMainWindow()  // 可选:提供自定义主窗口解析器app.use(singletonPlugin, {// 配置 singleton 插件})  }    }      win.loadPage('main')  // 类型安全      console.log(win.customId)  // 类型安全      app.registerMainWindow(win)      // ✅ win 的类型是 MyWindow    created(win, ctx) {  hooks: {  singleton: true,  app,const mainManager = createWindowManager<unknown, MyWindow>('main', {// 创建主窗口管理器}>  customId: 'main' | 'settings'type MyWindow = EnhancedBrowserWindow<{// 定义窗口类型})  rendererDir: path.join(__dirname, '../dist'),  preloadDir: __dirname,  name: 'MyApp',const app = createElectronApp({import { singletonPlugin } from '@escrcpy/electron-modularity/plugins'} from '@escrcpy/electron-modularity/main'  type EnhancedBrowserWindow   createWindowManager,  createElectronApp, import { // main.ts```typescript### 示例 2: 完全使用新 API```}  }    // ... 其他代码不变        })      }        }          app.emit('window:main:ready', win)          app.provide('window:main', win)          // 原有代码继续保留                    app.registerMainWindow(win)          // 新增这一行,其他保持不变        created(win) {      hooks: {      singleton: true,      app,    const manager = createWindowManager('main', {  apply(app) {export default {// desktop/electron/modules/main/index.js```javascript### 示例 1: 最小化改动 (向后兼容)## 完整迁移示例```}  mainWindowProvider?: MainWindowProvider  // ✅ 新增 (推荐)    mainWindowId?: string  // ❌ 已弃用 (仍然支持但不推荐)interface SingletonPluginOptions {```typescript#### 配置选项变更```})  mainWindowProvider: () => app.inject('window:custom')app.use(singletonPlugin, {// ✅ 方式 3: 使用 DI})  }    return manager?.get()    const manager = app.getWindowManager('control')  mainWindowProvider: () => {app.use(singletonPlugin, {// ✅ 方式 2: 提供自定义 mainWindowProviderapp.use(singletonPlugin)// ✅ 方式 1: 使用 app.getMainWindow() (默认行为)```typescript**迁移后:**```app.use(singletonPlugin)// ❌ 硬编码了 mainWindowId: 'main'```typescript**迁移前:**#### 移除硬编码### 4. singleton 插件解耦```const win = await resolveMainWindow(app)// 4. 等待 'window:main:ready' 事件// 3. inject('modules:main')// 2. registerMainWindow// 1. 自定义 resolver// resolveMainWindow 会按优先级查找:app.provide('modules:main', mainWindow)// 旧代码仍然可以工作```typescript**方式 3: 使用依赖注入 (兼容旧代码)**```const mainWindow = await resolveMainWindow(app)// 在任何地方解析主窗口})  return manager?.get()  const manager = app.getWindowManager('main')app.setMainWindowResolver(async (app) => {// 在应用启动时设置解析器```typescript**方式 2: 使用 `setMainWindowResolver` (灵活,适合复杂场景)**```mainWindow?.webContents.send('update-available')const mainWindow = app.getMainWindow()// 在任何地方获取主窗口})  }    }      app.emit('window:main:ready', win)      app.provide('window:main', win)      // 仍然保留旧的方式以保持兼容            app.registerMainWindow(win)  // ✅ 推荐    created(win) {  hooks: {  singleton: true,  app,const manager = createWindowManager('main', {// 在主窗口创建钩子中注册```javascript**方式 1: 使用 `registerMainWindow` (最简单,推荐)**#### 迁移示例```}  setMainWindowResolver(resolver: MainWindowResolver): this  // 设置自定义主窗口解析器    getMainWindow(): BrowserWindow | undefined  // 获取主窗口    registerMainWindow(win: BrowserWindow): this  // 注册主窗口 (推荐方式)interface ElectronApp {```typescript#### 新增 `ElectronApp` 方法### 3. 主窗口管理 API```})  }    }      console.log(win.__instanceId)  // ✅ 类型安全      win.loadPage('main')  // ✅ 类型安全      console.log(win.customId)  // ✅ 类型安全      // win 的类型是 MyWindow,支持所有增强属性    created(win, ctx) {  hooks: {const manager = createWindowManager<MyPayload, MyWindow>('main', { type MyWindow = EnhancedBrowserWindow<{ customId: 'main' | 'settings' }>// 新版本 (推荐)const win = manager.get()  // BrowserWindowconst manager = createWindowManager<MyPayload>('main', { ... })// 旧版本 (仍然兼容)```typescript`WindowManager` 现在支持自定义窗口类型:### 2. WindowManager 泛型化```console.log(win.customId)  // ✅ 类型安全const id = win.__instanceId  // ✅ 类型安全win.loadPage('main')  // ✅ 类型安全const win = createBrowserWindow({ ... })```typescript**迁移后:**```const id = (win as any).__instanceId  // ❌ 需要 as anywin.loadPage('main')  // ❌ TypeScript 报错: Property 'loadPage' does not existconst win = createBrowserWindow({ ... })```typescript**迁移前:**```}  customId?: string  __instanceId?: string  __managerId?: string  loadPage(pagePath?: string, query?: Record<string, any>): void  readonly raw: BrowserWindowinterface EnhancedBrowserWindow<TExtensions = object> extends BrowserWindow {```typescript新增的增强窗口类型,提供类型安全的属性和方法访问:#### `EnhancedBrowserWindow` 接口### 1. 类型系统增强## 主要变更2. **类型系统完善** - 引入 `EnhancedBrowserWindow` 消除 `as any` 断言1. **主窗口依赖解耦** - 移除了对业务层约定的硬编码依赖本次重构解决了两大核心问题：## 概述import electronStore from '$electron/helpers/store/index.js'
import { Edger } from '$electron/helpers/edger/index.js'
import { createWindowManager } from '@escrcpy/electron-modularity/main'
import { globalEventEmitter } from '$electron/helpers/emitter/index.js'

export default {
  name: 'module:main',
  apply(app) {
    if (!app?.has?.('remote:initialized')) {
      remote.initialize()
      app?.provide?.('remote:initialized', true)
    }

    const manager = createWindowManager('main', {
      app,
      singleton: true,
      windowOptions: {
        main: true,
        persistenceBounds: true,
      },
      hooks: {
        created(win) {
          // New recommended approach: Register main window for easy access
          app?.registerMainWindow?.(win)
          
          // Legacy approach: Still supported for backward compatibility
          app?.provide?.('window:main', win)
          app?.emit?.('window:main:ready', win)
        },
        ready(win) {
          win.show?.()
        },
      },
    })

    app?.provide?.('window:main:manager', manager)

    const openMainWindow = () => {
      const win = manager.open({ show: false })
      const mainWindow = win?.raw

      if (!mainWindow) {
        console.error('[module:main] Failed to create browser window')
        return null
      }

      try {
        remote.enable(mainWindow.webContents)
      }
      catch (error) {
        console.warn('[window] remote enable failed:', error?.message || error)
      }

      try {
        const executeArgsService = app?.inject?.('plugin:execute-arguments')
        if (executeArgsService) {
          const args = executeArgsService.getArguments?.()

          if (args) {
            mainWindow.webContents.send('execute-arguments-change', {
              deviceId: args['device-id'],
              appName: args['app-name'],
              packageName: args['package-name'],
            })
          }
        }
      }
      catch (error) {
        console.warn('[window] Failed to send execute arguments:', error?.message || error)
      }

      mainWindow.on('minimize', () => {
        globalEventEmitter.emit('tray:create')
      })

      if (electronStore.get('common.edgeHidden')) {
        try {
          new Edger(mainWindow)
        }
        catch (error) {
          console.warn('[window] Edger initialization failed:', error?.message || error)
        }
      }

      return mainWindow
    }

    app?.once?.('singleton:ready', async () => {
      try {
        await electronApp.whenReady()
        openMainWindow()
      }
      catch (error) {
        console.error('[module:main] Error waiting for app ready:', error)
      }
    })

    electronApp.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        openMainWindow()
        return
      }

      const win = manager.get?.()
      const mainWindow = win?.raw

      mainWindow?.show?.()
      mainWindow?.focus?.()

      if (process.platform === 'darwin') {
        electronApp.dock.show()
      }

      globalEventEmitter.emit('tray:destroy')
    })

    electronApp.on('window-all-closed', () => {
      electronApp.isQuiting = true
      electronApp.quit()
    })
  },
}

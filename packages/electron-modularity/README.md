# @escrcpy/electron-modularity

> Modular Electron application architecture with unctx-powered plugin system

---

## 🎉 What's New in v2.4

- ✨ **Type System Overhaul** - Eliminated all `any` types, full generic support
- 🔌 **Official Plugins** - Theme & Window IPC plugins included
- ⚠️ **Enhanced Robustness** - Circular dependency detection, conflict checking
- 📚 **Better DX** - Comprehensive examples, migration guide, improved docs

👉 **[See Upgrade Guide](./UPGRADE.md)** | **[Migration from Services](./MIGRATION.md)** | **[Examples](./examples/)**

---

## Features

- 🔌 **Plugin System** - Dependency injection and lifecycle management
- 🪟 **Window Manager** - Unified window lifecycle with hooks
- 🎯 **unctx Integration** - Async context propagation with `useElectronApp()` / `useWindowContext()`
- 💾 **Storage Abstraction** - Pluggable storage via dependency injection (supports electron-store, Redis, memory, etc.)
- 📦 **TypeScript-first** - Full type safety and IntelliSense with generics
- 🌳 **Tree-shakeable** - ESM-only with zero side effects
- 🧪 **Testable** - Fully mockable storage and dependencies
- 🎨 **Official Plugins** - Theme management, window IPC handlers, and more
- ⚠️ **Robust** - Circular dependency detection, conflict checking, error handling

## Installation

```bash
pnpm add @escrcpy/electron-modularity
```

## Quick Start

### 1. Create Electron App

```typescript
import { createElectronApp } from '@escrcpy/electron-modularity'
import { getAppBackgroundColor } from './helpers'
import { getLogoPath, browserWindowWidth, browserWindowHeight } from './configs'

const app = createElectronApp({
  name: 'MyApp',
  preloadDir: __dirname,
  rendererDir: path.join(__dirname, '../dist'),
  devRendererDir: process.env.VITE_DEV_SERVER_URL, // Dev server URL
  
  // Window defaults (optional)
  icon: getLogoPath(),
  width: browserWindowWidth,
  height: browserWindowHeight,
  backgroundColor: getAppBackgroundColor(),
})

// Register plugins
app.use(myPlugin)
app.use(servicesPlugin)

// Start
app.start()
```

> **Note**: The package includes a built-in `loadPage` function that automatically handles both development (dev server) and production (file) loading. You don't need to provide a custom `loadPage` unless you have special requirements.

### 2. Create Window Manager

```typescript
import { createWindowManager } from '@escrcpy/electron-modularity'

const mainWindow = createWindowManager('main', {
  app,
  singleton: true,
  windowOptions: {
    width: 1200,
    height: 800,
    persistenceBounds: true, // Auto-save window size
  },
  hooks: {
    created(win, ctx) {
      app.provide('window:main', win)
      app.emit('window:main:ready', win)
    },
    ready(win) {
      win.show()
    },
  },
})
```

### 3. Write Plugins

```typescript
export default {
  name: 'service:tray',
  deps: ['service:config'], // Dependencies
  order: -10, // Load order
  
  apply(app, options) {
    // Access app context
    const config = app.inject('service:config')
    
    // Provide services
    app.provide('service:tray', trayAPI)
    
    // Listen to events
    app.on('window:main:ready', (win) => {
      // Setup tray
    })
    
    // Return cleanup function
    return {
      dispose() {
        // Cleanup
      }
    }
  }
}
```

### 4. Use Official Plugins (Optional)

```typescript
import { createElectronApp } from '@escrcpy/electron-modularity'
import { themePlugin, windowIPCPlugin } from '@escrcpy/electron-modularity/plugins'

const app = createElectronApp({ /* ... */ })

// Add theme management
app.use(themePlugin, {
  storagePrefix: 'app',
  persist: true
})

// Add window IPC handlers
app.use(windowIPCPlugin)

app.start()
```

**Available Official Plugins:**

- **`themePlugin`** - Native theme management (system/light/dark) with IPC and persistence
- **`windowIPCPlugin`** - Window control IPC handlers (minimize, maximize, close, focus, etc.)

See [plugins/README.md](./plugins/README.md) for detailed plugin documentation.
```

## unctx Enhanced API

### useElectronApp()

Access app instance anywhere without explicit passing:

```typescript
import { useElectronApp } from '@escrcpy/electron-modularity'

export default {
  name: 'my-plugin',
  apply() {
    const app = useElectronApp() // ✨ Auto-injected
    app.provide('key', value)
  }
}
```

### useWindowContext()

Access window context in hooks:

```typescript
hooks: {
  async created(win) {
    const ctx = useWindowContext() // ✨ Auto-injected
    const { app, payload, meta } = ctx
  }
}
```

## API Reference

### createElectronApp(config)

Create application instance with plugin system.

**Config:**
- `name?: string` - App name
- `preloadDir?: string` - Preload directory
- `rendererDir?: string` - Renderer directory (production build)
- `devRendererDir?: string` - Development server URL (e.g., `process.env.VITE_DEV_SERVER_URL`)
- `loadPage?: (win, options) => void` - Custom page loader (optional, uses built-in by default)
- `icon?: string` - Default window icon path
- `width?: number` - Default window width
- `height?: number` - Default window height
- `backgroundColor?: string` - Default window background color
- `storage?: IStorage` - Storage adapter for persisting app/window state (defaults to ElectronStoreAdapter)

**Returns:** `ElectronApp`

**Methods:**
- `provide(key, value)` - Inject service
- `inject(key, fallback?)` - Retrieve service
- `use(plugin, options?)` - Register plugin
- `registerWindowManager(id, manager)` - Register window manager
- `getWindowManager(id)` - Get window manager
- `openWindow(id, payload?)` - Open window
- `start()` - Start app
- `stop()` - Stop and cleanup

**Example:**

```typescript
const app = createElectronApp({
  preloadDir: __dirname,
  rendererDir: path.join(__dirname, '../dist'),
  devRendererDir: process.env.VITE_DEV_SERVER_URL,
  icon: '/path/to/icon.png',
  width: 1200,
  height: 800,
})

// Custom loadPage is optional - built-in function handles dev/prod automatically
```

### loadPage(win, options)

Built-in page loader function (also exported for custom use).

**Options:**
- `prefix?: string` - URL prefix (e.g., 'main/')
- `query?: Record<string, any> | string` - Query parameters
- `rendererDir?: string` - Renderer directory for production
- `devRendererDir?: string` - Development server URL

**Example:**

```typescript
import { loadPage } from '@escrcpy/electron-modularity'

loadPage(win, {
  prefix: 'main/',
  query: { id: '123' },
  rendererDir: path.join(__dirname, '../dist'),
  devRendererDir: process.env.VITE_DEV_SERVER_URL,
})
```

### createWindowManager(name, options)

Create window manager with lifecycle hooks.

**Options:**
- `app?: ElectronApp` - Parent app
- `singleton?: boolean` - Single instance mode
- `windowOptions?: BrowserWindowConstructorOptions | Function` - Window config
- `create?: (context) => BrowserWindow` - Custom window factory
- `load?: (win, context) => void` - Custom page loader
- `hooks?: WindowHooks` - Lifecycle hooks

**Hooks:**
- `beforeCreate(context)` - Before window creation
- `created(win, context)` - After window created
- `ready(win, context)` - Window ready to show
- `beforeShow(win, context)` - Before showing existing window
- `shown(win, context)` - Window shown
- `hidden(win, context)` - Window hidden
- `focus(win, context)` - Window focused
- `blur(win, context)` - Window blurred
- `beforeClose(win, context)` - Before window closes
- `closed(win, context)` - Window closed

### createBrowserWindow(options)

Create BrowserWindow with template configuration.

**Options (extends BrowserWindowConstructorOptions):**
- `preloadDir: string` - Preload directory (required)
- `rendererDir?: string` - Renderer directory
- `main?: boolean` - Is main window
- `persistenceBounds?: boolean` - Auto-save window size
- `icon?: string` - Window icon path
- `width?: number` - Window width (default: 900)
- `height?: number` - Window height (default: 650)
- `backgroundColor?: string` - Background color (default: transparent)
- `loadPage?: (win, options) => void` - Custom page loader function
- `storage?: IStorage` - Storage adapter for window state (inherits from app if not provided)

**Example:**

```typescript
const win = createBrowserWindow({
  preloadDir: __dirname,
  rendererDir: path.join(__dirname, '../dist'),
  width: 1200,
  height: 800,
  persistenceBounds: true,
  loadPage: (win, { prefix, query, rendererDir }) => {
    // Custom page loading logic
    win.loadURL(`file://${rendererDir}/${prefix}index.html`)
  }
})
```

## Architecture

```
packages/electron-modularity/
├── main/
│   ├── index.ts          # Public exports
│   ├── app.ts            # createElectronApp + unctx
│   ├── window-manager.ts # createWindowManager
│   └── types.ts          # TypeScript definitions
├── shared/
│   ├── interfaces.ts     # IStorage interface
│   ├── adapters/
│   │   └── storage-adapter.ts  # ElectronStoreAdapter
│   ├── template.ts       # BrowserWindow template
│   └── helpers.ts        # Utility functions
└── dist/
    ├── index.mjs         # ESM bundle
    └── index.d.mts       # Type declarations
```

## Storage System

The package uses **dependency injection** for storage, making it fully testable and extensible:

```typescript
import { createElectronApp, type IStorage } from '@escrcpy/electron-modularity'

// Default: Uses ElectronStoreAdapter automatically
const app = createElectronApp({ ... })

// Custom: Provide your own storage
const app = createElectronApp({
  storage: new MyCustomStorage(),
})
```

See [STORAGE_GUIDE.md](./STORAGE_GUIDE.md) for complete examples.

## Design Principles

- ✅ **No global state** - All state encapsulated in instances
- ✅ **Async-safe** - unctx AsyncLocalStorage for context propagation
- ✅ **Dependency injection** - Explicit service registration and storage abstraction
- ✅ **Lifecycle management** - Proper cleanup on app stop
- ✅ **Type-safe** - Full TypeScript coverage
- ✅ **Testable** - Mockable storage and dependencies

## Migration from helpers/core

All existing code remains compatible:

```typescript
// Before
import { createElectronApp } from '$electron/helpers/core/index.js'

// After
import { createElectronApp } from '@escrcpy/electron-modularity'
```

API signatures unchanged - drop-in replacement.

## License

MIT

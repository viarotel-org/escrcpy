# Official Plugins

This directory contains official plugins for `@escrcpy/electron-modularity`.

## Available Plugins

### Core Plugins

- **theme** - Native theme management with IPC handlers
- **window-ipc** - Window control IPC handlers (minimize, maximize, close, etc.)

## Plugin Structure

Each plugin should follow this structure:

```
plugin-name/
├── index.ts          # Main plugin export
├── types.ts          # TypeScript types (optional)
├── README.md         # Plugin documentation
└── package.json      # Plugin metadata (optional)
```

## Creating a Plugin

### Basic Plugin Template

```typescript
import type { Plugin } from '../../main/types'

export interface MyPluginOptions {
  // Plugin configuration options
}

export interface MyPluginAPI {
  // Plugin public API
}

export const myPlugin: Plugin<MyPluginAPI, MyPluginOptions> = {
  name: 'my-plugin',
  order: 0,
  deps: [], // Dependencies on other plugins
  
  apply(app, options) {
    // Plugin initialization logic
    
    const api: MyPluginAPI = {
      // Public API methods
    }
    
    // Provide services
    app.provide('my-plugin:api', api)
    
    // Listen to events
    app.on('app:started', () => {
      console.log('My plugin started')
    })
    
    // Return API or cleanup function
    return api
  },
  
  dispose() {
    // Cleanup logic
  }
}

export default myPlugin
```

### With Dependencies

```typescript
export const advancedPlugin: Plugin = {
  name: 'advanced-plugin',
  deps: ['service:config', 'service:storage'],
  order: 10, // Load after dependencies
  
  apply(app) {
    // Inject dependencies
    const config = app.inject('service:config')
    const storage = app.inject('service:storage')
    
    // Use dependencies
    const setting = config.get('advanced.enabled')
    
    // ... plugin logic
  }
}
```

## Usage

```typescript
import { createElectronApp } from '@escrcpy/electron-modularity'
import { themePlugin, windowIPCPlugin } from '@escrcpy/electron-modularity/plugins'

const app = createElectronApp({
  // ... config
})

app.use(themePlugin)
app.use(windowIPCPlugin)

app.start()
```

## Plugin Best Practices

1. **Clear Naming** - Use descriptive plugin names with prefix (e.g., `service:`, `module:`)
2. **Dependency Declaration** - Always declare dependencies in `deps` array
3. **Order Control** - Use `order` for load sequence (negative = early, positive = late)
4. **Type Safety** - Provide full TypeScript types for options and API
5. **Cleanup** - Implement `dispose()` for proper resource cleanup
6. **Error Handling** - Use try-catch and emit errors via `app.emit('plugin:error', error)`
7. **Documentation** - Include JSDoc comments and README
8. **Testing** - Write unit tests for plugin logic

## Event Lifecycle

Plugins can listen to these built-in events:

- `app:started` - App has started
- `app:stopped` - App is stopping
- `plugin:installed` - Plugin was installed
- `plugin:error` - Plugin error occurred
- `plugin:warning` - Plugin warning occurred
- `window:*:ready` - Window ready events
- Custom events from other plugins

## Contributing

To add a new official plugin:

1. Create plugin directory under `plugins/`
2. Implement plugin following template
3. Add exports to `plugins/index.ts`
4. Update this README
5. Add tests and documentation

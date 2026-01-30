# Window IPC Plugin

Window control IPC handlers for Electron Modularity.

## Features

- 🪟 Window control (minimize, maximize, close)
- 📊 Window state tracking (is-maximized)
- 🔄 Multi-window management (open, close, destroy, focus by ID)
- ⚙️ Configurable handlers
- 🧹 Automatic cleanup

## Installation

```typescript
import { createElectronApp } from '@escrcpy/electron-modularity'
import { windowIPCPlugin } from '@escrcpy/electron-modularity/plugins'

const app = createElectronApp({
  // ... config
})

app.use(windowIPCPlugin)
```

## Configuration

```typescript
app.use(windowIPCPlugin, {
  channelPrefix: 'win', // IPC channel prefix (default: 'window')
  handlers: {
    minimize: true,      // Enable minimize handler (default: true)
    maximize: true,      // Enable maximize handler (default: true)
    close: true,         // Enable close handler (default: true)
    isMaximized: true,   // Enable is-maximized tracker (default: true)
    open: true,          // Enable open-by-id handler (default: true)
    closeById: true,     // Enable close-by-id handler (default: true)
    destroyById: true,   // Enable destroy-by-id handler (default: true)
    focusById: true,     // Enable focus-by-id handler (default: true)
  }
})
```

## IPC Channels

### Basic Window Control

```typescript
// Minimize current window
await ipcRenderer.invoke('window-minimize')

// Maximize/Unmaximize current window
await ipcRenderer.invoke('window-maximize')

// Close current window
await ipcRenderer.invoke('window-close')

// Track maximize state
await ipcRenderer.invoke('window-is-maximized', (isMax) => {
  console.log('Window maximized:', isMax)
})
```

### Multi-Window Management

```typescript
// Open window by manager ID
await ipcRenderer.invoke('window-open', {
  id: 'settings',
  options: { page: 'settings' }
})

// Close window by ID
await ipcRenderer.invoke('window-close-by-id', {
  id: 'settings',
  instanceId: 'settings:abc123' // Optional
})

// Destroy window by ID
await ipcRenderer.invoke('window-destroy-by-id', {
  id: 'settings',
  instanceId: 'settings:abc123' // Optional
})

// Focus window by ID
await ipcRenderer.invoke('window-focus-by-id', {
  id: 'main'
})
```

## Custom Channel Prefix

```typescript
app.use(windowIPCPlugin, {
  channelPrefix: 'my-app-window'
})

// Renderer
await ipcRenderer.invoke('my-app-window-minimize')
await ipcRenderer.invoke('my-app-window-maximize')
```

## Cleanup

Cleanup is automatic and includes:

- IPC handler removal
- Window event listener cleanup
- Triggered on plugin disposal

## Type Definitions

```typescript
interface WindowIPCPluginOptions {
  channelPrefix?: string
  handlers?: {
    minimize?: boolean
    maximize?: boolean
    close?: boolean
    isMaximized?: boolean
    open?: boolean
    closeById?: boolean
    destroyById?: boolean
    focusById?: boolean
  }
}
```

## Integration with Window Managers

This plugin works seamlessly with window managers:

```typescript
import { createElectronApp, createWindowManager } from '@escrcpy/electron-modularity'
import { windowIPCPlugin } from '@escrcpy/electron-modularity/plugins'

const app = createElectronApp({ ... })

// Create window managers
createWindowManager('main', { app, singleton: true })
createWindowManager('settings', { app, singleton: true })

// Enable IPC
app.use(windowIPCPlugin)

// Renderer can now control windows
// await ipcRenderer.invoke('window-open', { id: 'settings' })
```

# Singleton Plugin

Single instance management plugin for Electron Modularity.

## Features

- 🔒 Ensures only one app instance runs at a time
- 🔄 Handles second instance launches gracefully
- 📨 Automatic command-line argument parsing and injection
- 🎯 Auto-start behavior when device ID is provided
- 🪟 Window activation and focus management
- ⚙️ Configurable event names and IPC channels
- 🧹 Automatic cleanup on app quit

## Installation

```typescript
import { createElectronApp } from '@escrcpy/electron-modularity'
import { singletonPlugin, executeArgumentsPlugin } from '@escrcpy/electron-modularity/plugins'

const app = createElectronApp({
  // ... config
})

// IMPORTANT: Load execute-arguments plugin first
app.use(executeArgumentsPlugin)
app.use(singletonPlugin)
```

## Configuration

```typescript
app.use(singletonPlugin, {
  serviceName: 'plugin:singleton',            // DI service name (default)
  readyEventName: 'singleton:ready',           // Event emitted when ready (default)
  executeArgsUpdateChannel: 'execute-arguments-change', // IPC channel for args update (default)
  autoStartChannel: 'auto-start-app',          // IPC channel for auto-start (default)
  forceFocus: true,                            // Force-focus window (default: true)
  silentMode: false,                           // Silent mode (default: false)
  mainWindowId: 'main',                        // Main window ID (default: 'main')
})
```

## Usage

### Listen for Singleton Ready

```typescript
app.on('singleton:ready', () => {
  console.log('Singleton lock acquired, safe to create window')
  // Create your main window here
})
```

### Second Instance Behavior

When a user tries to launch a second instance:

1. **With `--device-id` parameter:**
   ```bash
   ./app --device-id=12345 --app-name=MyApp
   ```
   - Parses and injects arguments into environment
   - Sends `execute-arguments-change` IPC message to renderer
   - Sends `auto-start-app` IPC message to trigger auto-start

2. **Without `--device-id` parameter:**
   ```bash
   ./app
   ```
   - Shows and focuses the existing main window
   - Does not trigger auto-start

### Renderer Process Integration

```typescript
// In renderer process
import { ipcRenderer } from 'electron'

// Listen for argument updates
ipcRenderer.on('execute-arguments-change', (event, args) => {
  console.log('New arguments:', args)
  // args: { deviceId: '12345', appName: 'MyApp', packageName: 'com.example' }
})

// Listen for auto-start signal
ipcRenderer.on('auto-start-app', () => {
  console.log('Auto-starting app with new device...')
  // Start your app logic here
})
```

## Dependencies

This plugin **depends on** `plugin:execute-arguments` to parse command-line arguments.

**Load order:**
```typescript
app.use(executeArgumentsPlugin)  // Must load first
app.use(singletonPlugin)          // Declares dependency
```

The plugin system will automatically ensure correct load order based on the `deps` declaration.

## Custom Event Names

You can customize event and channel names:

```typescript
app.use(singletonPlugin, {
  readyEventName: 'my-app:singleton-ready',
  executeArgsUpdateChannel: 'my-app:args-update',
  autoStartChannel: 'my-app:auto-start',
})

// Listen with custom name
app.on('my-app:singleton-ready', () => {
  // ...
})
```

## Custom Service Name

```typescript
app.use(singletonPlugin, {
  serviceName: 'my-app:singleton'
})

// Access with custom name (though this plugin doesn't expose an API)
// It's mainly for DI traceability
```

## Window Focus Control

You can disable force-focus if you want manual control:

```typescript
app.use(singletonPlugin, {
  forceFocus: false
})
```

## Silent Mode

Suppress console logs:

```typescript
app.use(singletonPlugin, {
  silentMode: true
})
```

## Example: Complete Setup

```typescript
import { createElectronApp } from '@escrcpy/electron-modularity'
import { 
  executeArgumentsPlugin, 
  singletonPlugin 
} from '@escrcpy/electron-modularity/plugins'

const app = createElectronApp({
  // ... config
})

// Load plugins in order
app.use(executeArgumentsPlugin)
app.use(singletonPlugin)

// Wait for singleton ready
app.on('singleton:ready', () => {
  console.log('Ready to create main window')
  
  const manager = app.getWindowManager('main')
  manager.create()
})

// Start app
app.start()
```

## License

MIT

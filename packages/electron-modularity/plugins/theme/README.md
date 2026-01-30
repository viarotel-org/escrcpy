# Theme Plugin

Native theme management plugin for Electron Modularity.

## Features

- 🎨 Native theme control (system/light/dark)
- 💾 Automatic theme persistence to storage
- 🔌 IPC handlers for renderer process
- 🧹 Automatic cleanup on app quit
- ⚙️ Configurable storage and IPC prefixes

## Installation

```typescript
import { createElectronApp } from '@escrcpy/electron-modularity'
import { themePlugin } from '@escrcpy/electron-modularity/plugins'

const app = createElectronApp({
  // ... config
})

app.use(themePlugin)
```

## Configuration

```typescript
app.use(themePlugin, {
  storagePrefix: 'app',      // Storage key prefix (default: 'common')
  persist: true,             // Enable persistence (default: true)
  ipcPrefix: 'my-app-theme', // IPC channel prefix (default: 'app-theme')
})
```

## API

### Access Theme API

```typescript
import type { ThemePluginAPI } from '@escrcpy/electron-modularity/plugins'

// In another plugin or after app.start()
const themeAPI = app.inject<ThemePluginAPI>('plugin:theme')

// Get current theme
const theme = themeAPI.value() // 'system' | 'light' | 'dark'

// Update theme
themeAPI.update('dark')

// Check if dark mode
const isDark = themeAPI.isDark() // boolean
```

## IPC Usage (Renderer Process)

```typescript
// Get current theme
const theme = await ipcRenderer.invoke('app-theme-value')

// Update theme
await ipcRenderer.invoke('app-theme-update', 'dark')

// Check if dark mode
const isDark = await ipcRenderer.invoke('app-theme-isDark')
```

## Storage

When persistence is enabled, the plugin stores:

- `${prefix}.theme` - Current theme source ('system' | 'light' | 'dark')
- `${prefix}.isDark` - Current dark mode state (boolean)

## Events

The plugin listens to:

- `nativeTheme.updated` - Updates storage when theme changes

## Cleanup

Cleanup is automatic and includes:

- IPC handler removal
- Event listener cleanup
- Triggered on `app.before-quit` event

## Type Definitions

```typescript
interface ThemePluginOptions {
  storagePrefix?: string  // Default: 'common'
  persist?: boolean       // Default: true
  ipcPrefix?: string      // Default: 'app-theme'
}

interface ThemePluginAPI {
  value(): 'system' | 'light' | 'dark'
  update(theme: 'system' | 'light' | 'dark'): void
  isDark(): boolean
}
```

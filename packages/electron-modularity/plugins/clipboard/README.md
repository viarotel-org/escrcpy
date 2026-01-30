# Clipboard Plugin

System clipboard management plugin for Electron Modularity.

## Features

- 📋 Cross-platform clipboard operations (macOS, Windows, Linux)
- 🖼️ Image file support with automatic format detection
- 📁 Generic file path copying with platform-specific formats
- 🔌 IPC handlers for renderer process
- 🧹 Automatic cleanup on app quit
- ⚙️ Configurable service name and IPC prefix

## Installation

```typescript
import { createElectronApp } from '@escrcpy/electron-modularity'
import { clipboardPlugin } from '@escrcpy/electron-modularity/plugins'

const app = createElectronApp({
  // ... config
})

app.use(clipboardPlugin)
```

## Configuration

```typescript
app.use(clipboardPlugin, {
  serviceName: 'plugin:clipboard', // DI service name (default: 'plugin:clipboard')
  ipcPrefix: '',                     // IPC channel prefix (default: '')
})
```

## API

### Access Clipboard API

```typescript
import type { ClipboardPluginAPI } from '@escrcpy/electron-modularity/plugins'

// In another plugin or after app.start()
const clipboardAPI = app.inject<ClipboardPluginAPI>('plugin:clipboard')

// Copy file to clipboard
await clipboardAPI.copyFile('/path/to/image.png')
// Returns: { success: true, message: 'File copied to clipboard successfully' }

// Copy text to clipboard
await clipboardAPI.copyText('Hello World')
// Returns: { success: true, message: 'Text copied to clipboard successfully' }
```

### IPC Usage (Renderer Process)

```typescript
// Copy file
const result = await ipcRenderer.invoke('copy-file-to-clipboard', '/path/to/file.png')
console.log(result) // { success: true, message: '...' }

// Copy text
const result = await ipcRenderer.invoke('copy-text-to-clipboard', 'Hello World')
console.log(result) // { success: true, message: '...' }
```

## Platform Support

### macOS
- `public.file-url` - File URL format
- `NSFilenamesPboardType` - Plist format
- Plain text fallback

### Windows
- `FileNameW` - UTF-16 encoding
- `CF_HDROP` - Drag-and-drop format
- `FileName` - ANSI encoding (legacy)
- Plain text fallback

### Linux
- `text/uri-list` - Standard URI list
- `application/x-kde-cutselection` - KDE format
- `x-special/gnome-copied-files` - GNOME format
- `text/x-moz-url` - Mozilla URL format
- Plain text fallback

## Image File Detection

The plugin automatically detects image files by extension:
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.webp`, `.ico`, `.tiff`, `.tif`

For image files, the plugin copies both the image content and file path to clipboard.

## Custom Service Name

You can customize the service name for dependency injection:

```typescript
app.use(clipboardPlugin, {
  serviceName: 'my-app:clipboard'
})

// Access with custom name
const api = app.inject<ClipboardPluginAPI>('my-app:clipboard')
```

## License

MIT

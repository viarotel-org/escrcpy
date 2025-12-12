# Escrcpy AI Coding Assistant Instructions

## Project Overview

Escrcpy is an Electron-based GUI for scrcpy that provides graphical device management for Android devices. The architecture uses a multi-process design with distinct responsibilities:

- **Main Process** (`electron/`): Core Electron logic, IPC handlers, native integrations
- **Renderer Process** (`src/`): Vue 3 application for the main device management UI
- **Control Window** (`control/`): Floating device control bar with independent window
- **Explorer Window** (`explorer/`): File manager for Android devices with independent window

## Tech Stack & Build System

- **Runtime**: Electron 33 + Node.js v20+, Vue 3 with Composition API
- **Package Manager**: pnpm (required via `corepack enable pnpm`)
- **Build Tool**: Vite with custom multi-entry configuration
- **Bundler**: electron-builder for cross-platform packaging
- **External Tools**: Bundled binaries in `electron/resources/extra/{platform}/` for scrcpy, adb, gnirehtet, copilot

### Development Commands

```bash
pnpm dev              # Start dev server (port 1535)
pnpm build            # Build for current platform
pnpm build:{win|mac|linux}  # Platform-specific builds
```

## Architecture Patterns

### 1. Main-Renderer Bridge Pattern

The project uses `contextBridge.exposeInMainWorld` to expose APIs to renderers. All exposures are centralized in `electron/exposes/`:

```javascript
// Pattern used in electron/exposes/scrcpy/index.js, gnirehtet/index.js
export default {
  shell(command, options) { /* spawn wrapper */ },
  // Other methods...
}
```

Access in renderer: `window.scrcpy`, `window.adb`, `window.gnirehtet`, `window.electron`

### 2. ProcessManager for External Tools

All external binary executions (scrcpy, adb, gnirehtet) use `ProcessManager` from `electron/helpers/index.js`:

```javascript
const processManager = new ProcessManager()
const process = spawn(command, args, { env: { ...process.env, ADB: adbPath } })
processManager.add(process)  // Auto-cleanup on quit-before event
```

**Critical**: External tool wrappers MUST inject `ADB` environment variable (see `electron/exposes/gnirehtet/index.js:36` and `electron/exposes/scrcpy/index.js:21`)

### 3. Multi-Window Architecture

Each auxiliary window (`control`, `explorer`, `copilot`) follows this pattern:

- Independent entry in `vite.config.js` rollupOptions
- Main process handler in `{module}/electron/main.js` 
- Window initialization helper in `{module}/electron/helpers/`
- IPC events in `{module}/electron/events/`
- Maps device ID to window instance to prevent duplicates

### 4. Configuration Management

**electron-store** for persistence (`electron/helpers/store.js`):
- Main config file: `config.json` in app data directory
- Store structure: `{ common: {...}, device: {...}, preference: {...} }`
- Access: `appStore.get('device')` or `window.appStore.get('device')` in renderer
- Device-specific configs: Each device (by `id`) has independent settings

## Key File Locations

- **Path configs**: `electron/configs/` - Platform-specific binary paths
- **Command builder**: `src/utils/command/index.js` - Converts JS objects to CLI args
- **Device store**: `src/store/device/index.js` - Pinia store for device state
- **IPC handlers**: `electron/ipc/` - Main process IPC handlers
- **i18n**: `src/locales/languages/{locale}.json` - Translations for UI

## Common Development Patterns

### Adding a New Expose API

1. Create module in `electron/exposes/{name}/index.js`
2. Register in `electron/exposes/index.js`: `expose('{name}', {name})`
3. Access in renderer: `window.{name}`

### Creating a New Auxiliary Window

1. Add HTML entry: `{module}/index.html`
2. Add to Vite config: `rollupOptions.input.{module}`
3. Create main handler: `{module}/electron/main.js`
4. Register in `electron/main.js`: `import {module} from '${module}/electron/main.js'`
5. Open via IPC: `window.electron.ipcRenderer.invoke('open-{module}-window', data)`

### Working with Devices

- Device list structure: `{ id, name, remark, $custom: {...} }`
- Custom configs stored in `appStore.get('device')[deviceId]`
- Use `useDeviceStore().getLabel(device, 'type')` for consistent naming

### Executing External Binaries

Always follow the pattern from `electron/exposes/gnirehtet/index.js`:
- Get path from store with fallback: `appStore.get('common.{tool}Path') || {tool}Path`
- Use `spawn()` with `shell: true` for quoted paths
- Inject ADB path: `env: { ...process.env, ADB: adbPath }`
- Add to ProcessManager for cleanup

## Conventions

- **Commit messages**: Follow Angular conventions (feat:, fix:, docs:, etc.)
- **i18n keys**: Use dot notation matching file structure (e.g., `device.action.mirror`)
- **Component naming**: PascalCase for components, kebab-case for files
- **Store naming**: `use{Name}Store` pattern with Pinia
- **IPC channels**: Use `kebab-case` (e.g., `open-control-window`)

## Critical Notes

- **PATH issue on macOS**: Use `fix-path` package to ensure correct PATH in spawned processes
- **Binary execution**: Always quote executable paths with `"${spawnPath}"` to handle spaces
- **Window lifecycle**: Check `isWindowDestroyed()` before manipulating windows
- **Quit handling**: Listen to `quit-before` event for cleanup (IPC from main process)
- **Debug mode**: Enable in preferences to see DevTools and verbose logging

## Integration Example: Copilot Feature

Reference implementation from `copilot/README.md`:
- Store config: `appStore.get('copilot')` with `{ baseUrl, apiKey, model, prompts }`
- Binary path: `electron/resources/extra/{os}/copilot` 
- Expose pattern: `electron/exposes/copilot/` with ADB env injection
- UI module: `copilot/` with Vue SFC architecture
- Integration points: Device list action button, batch actions menu

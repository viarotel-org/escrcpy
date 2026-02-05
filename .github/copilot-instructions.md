# Escrcpy AI Agent Instructions

Escrcpy is an Electron-based GUI for Android device mirroring and control powered by Scrcpy. This is a **pnpm workspace + Turborepo monorepo** with multiple custom Electron packages.

## Architecture Overview

### Monorepo Structure

- **`desktop/`**: Main Electron app with multi-window renderer architecture
  - `src/`: Main window (Vue 3 + file-based routing via `unplugin-vue-router`)
  - `control/`: Floating control bar window
  - `explorer/`: File explorer window  
  - `copilot/`: AI assistant window (AutoGLM integration)
  - `electron/`: Main process with modular plugin-based setup
- **`packages/`**: Custom workspace packages
  - `@escrcpy/electron-setup`: Modular Electron app framework with plugin system, window management, contextual DI
  - `@escrcpy/electron-ipcx`: Function-friendly IPC enabling callbacks/functions to cross main-renderer boundary via proxy channels
  - `autoglm.js`: AI automation library for AutoGLM integration
  - `autoglm.js-adb-keyboard/`: ADB keyboard input utilities
  - `autoglm.js-shared/`: Shared utilities
- **`docs/`**: VitePress documentation (multilingual)

### Electron Main Process Pattern

Main process uses **plugin-based architecture** via `@escrcpy/electron-setup`:

```javascript
// desktop/electron/main.js
const mainApp = createElectronApp({
  preloadDir: __dirname,
  plugins: [clipboardPlugin, sandboxPlugin, themePlugin, windowIPCPlugin],
  modules: [main, control, copilot, explorer], // Window modules
  services: [contextMenu, edger, handles, launch, lifecycle, listeners, shortcuts, tray, updater],
})
```

**Window Management**: Use `createWindowManager(name, options)` for each window type. Windows support `singleton`, `mainWindow`, and `persistenceBounds` options.

**IPC Communication**: Prefer `@escrcpy/electron-ipcx` over raw IPC when passing callbacks:
- Renderer: `ipcxRenderer.invoke(channel, { onProgress: (v) => ... })`
- Main: `ipcxMain.handle(channel, (event, args) => { args.onProgress(50) })`

### Frontend Patterns

**Vue 3 Composition API**: All components use `<script setup>`. Auto-imports enabled for Vue APIs, VueUse, Pinia stores, and router.

**State Management**: Pinia stores in `desktop/src/store/`. Example: `useDeviceStore()` manages device list/config with electron-store persistence.

**File-based Routing**: Pages in `desktop/src/views/` auto-generate routes via `unplugin-vue-router`. Use `definePage()` macro for metadata.

**Styling**: UnoCSS (Tailwind-compatible) with custom shades preset. Use utility classes. PostCSS with nested syntax support.

**Composables**: Custom hooks in `desktop/src/hooks/` (e.g., `useScaleScreen` for screen dimension scaling calculations).

## Critical Developer Workflows

### Development
```bash
pnpm install      # Install all workspace dependencies
pnpm dev          # Start all dev servers (Turbo orchestrated)
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix linting issues
```

### Building
```bash
pnpm build              # Auto-detect platform
pnpm build:win          # Windows build
pnpm build:mac          # macOS build (arm64 + x64)
pnpm build:linux        # Linux build
```

### Package Development
```bash
cd packages/electron-setup
pnpm dev          # Watch mode (tsdown)
pnpm build        # Build package
```

### Documentation
```bash
pnpm docs:dev      # Start VitePress dev server
pnpm docs:build    # Build docs
```

## Project-Specific Conventions

### Aliasing System
Extensive path aliases defined in `desktop/vite.config.js`:
- `$` → `desktop/src/`
- `$root` → `desktop/`
- `$electron` → `desktop/electron/`
- `$control`, `$explorer`, `$copilot` → respective window directories

Always use aliases in imports.

### ESLint Configuration
- Based on `@antfu/eslint-config`
- Auto-import globals from `.eslintrc-auto-import.json` (generated)
- Many Vue rules relaxed (e.g., `vue/html-self-closing`, `vue/block-order` off)
- Access globals: `definePage`, `i18n`, `t`

### Commit Messages
Follow **Angular commit convention**:
- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `docs(scope): description` - Documentation
- `refactor(scope): description` - Code restructuring
- `chore(scope): description` - Maintenance tasks

### Internationalization
- i18next-based with file backend
- Locale files in `desktop/src/locales/`
- Global `i18n` and `t()` auto-imported
- Use `pnpm lang-sync` to sync translation keys

### External Dependencies

**Android Tools**: Relies on external binaries bundled in `desktop/electron/resources/`:
- **scrcpy**: Core screen mirroring (resolved via `getScrcpyPath()`)
- **gnirehtet**: Reverse tethering (resolved via `getGnirehtetPath()`)
- **adbkit**: ADB communication library (`@devicefarmer/adbkit`)

Paths resolved via `desktop/electron/configs/which/index.js` with fallback to user-configured paths in electron-store.

**AI Integration**: AutoGLM.js enables natural language device control via `copilot/` window.

### Multi-Window Entry Points
Main entry points defined in `desktop/vite.config.js`:
```javascript
input: {
  main: 'index.html',
  control: 'control/index.html',
  explorer: 'explorer/index.html',
  copilot: 'copilot/index.html',
}
```

Each window has its own `App.vue` and `index.js` bootstrapper.

### Persistence Strategy
- **Electron Store**: Config persisted via `electron-store` (accessed as `window.$preload.store` in renderer)
- **Pinia Persistence**: `pinia-plugin-persistedstate` for selective store persistence
- **Dexie**: IndexedDB wrapper (seen in dependencies, likely for device history)

## Common Gotchas

1. **Platform-specific builds**: macOS produces both arm64 and x64 builds. Check `pnpm-workspace.yaml` `supportedArchitectures`.

2. **Electron Fix**: If encountering "Electron failed to install correctly" errors, run `pnpm electron-fix` (uses electron-fix package).

3. **Turbo Caching**: Build tasks in `turbo.json` have `cache: false` for electron builds. Don't rely on Turbo cache for production builds.

4. **Sharp/Native Dependencies**: Pinned versions in `pnpm-workspace.yaml` overrides. Handle carefully due to native bindings.

5. **Type Safety**: TypeScript used in packages, but main desktop app uses JSDoc + JSConfig for type hints. No strict TS compilation for Electron main/renderer.

6. **Window Communication**: Use `@escrcpy/electron-ipcx` when callbacks needed, otherwise standard `ipcRenderer.invoke` / `ipcMain.handle`.

## Key Files Reference

- [desktop/electron/main.js](desktop/electron/main.js) - Main process entry, plugin orchestration
- [desktop/src/store/device/index.js](desktop/src/store/device/index.js) - Device state management pattern
- [desktop/vite.config.js](desktop/vite.config.js) - Multi-window build config, aliases
- [packages/electron-setup/](packages/electron-setup/) - Core Electron framework patterns
- [packages/electron-ipcx/README.md](packages/electron-ipcx/README.md) - IPC function proxy mechanism
- [desktop/src/hooks/useScaleScreen/index.js](desktop/src/hooks/useScaleScreen/index.js) - Complex composable pattern example
- [eslint.config.js](eslint.config.js) - Linting rules and auto-import integration

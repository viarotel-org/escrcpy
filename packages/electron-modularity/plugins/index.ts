/**
 * Official plugins for @escrcpy/electron-modularity
 *
 * @packageDocumentation
 */

// Clipboard plugin
export { clipboardPlugin } from './clipboard/index.js'
export type { ClipboardPluginAPI, ClipboardPluginOptions } from './clipboard/index.js'

// Sandbox plugin
export { sandboxPlugin } from './sandbox/index.js'
export type { SandboxConfigResult, SandboxPluginOptions } from './sandbox/index.js'

// Theme plugin
export { themePlugin } from './theme/index.js'
export type { ThemePluginAPI, ThemePluginOptions } from './theme/index.js'

// Window IPC plugin
export { windowIPCPlugin } from './window-ipc/index.js'
export type { WindowIPCPluginOptions } from './window-ipc/index.js'

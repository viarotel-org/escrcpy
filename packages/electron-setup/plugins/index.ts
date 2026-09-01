/**
 * Official plugins for @escrcpy/electron-setup
 *
 * @packageDocumentation
 */

// Clipboard plugin
export { clipboardPlugin } from './clipboard/index.js'
export type { ClipboardPluginAPI, ClipboardPluginOptions } from './clipboard/index.js'

// Sandbox configuration
export { configureSandbox, SandboxManager } from './sandbox/helper.js'
export type { SandboxConfigResult, SandboxManagerOptions } from './sandbox/helper.js'

// Theme plugin
export { themePlugin } from './theme/index.js'
export type { ThemePluginAPI, ThemePluginOptions } from './theme/index.js'

// Window IPC plugin
export { windowIPCPlugin } from './window-ipc/index.js'
export type { WindowIPCPluginOptions } from './window-ipc/index.js'

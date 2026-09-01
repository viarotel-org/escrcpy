import { execSync } from 'node:child_process'

/**
 * Resolve the Electron download mirror from the user's npm config, so
 * `electronDownload.mirror` follows the same mirror setting the rest of the
 * toolchain (npm/pnpm) already uses. Returns undefined when no mirror is
 * configured, letting electron-builder fall back to the official source.
 */
export function resolveElectronMirror() {
  const raw = execSync('npm config get electron_mirror').toString().trim()
  return (raw && raw !== 'undefined') ? raw : undefined
}

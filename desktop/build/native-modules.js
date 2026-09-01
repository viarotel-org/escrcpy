/**
 * Packaging rules for native / platform-specific dependencies.
 *
 * pnpm 10+ does not auto-install transitive platform binaries, so the app
 * bundle must explicitly exclude foreign-platform variants of sharp,
 * @lydell/node-pty and @techstark/opencv-js, then re-include only the
 * variants matching the current ${platform}-${arch}. sharp and node-pty are
 * native modules and must additionally be unpacked from the asar archive to
 * be loadable.
 */

/** File filters keeping only the current platform's native module variants. */
export const files = [
  'dist',
  'dist-electron',
  '!**/node_modules/@lydell/node-pty-*/**/*',
  '**/node_modules/@lydell/node-pty-*${platform}-${arch}/**/*',
]

/** Native modules that must live on disk outside the asar archive. */
export const asarUnpack = [
  '**/node_modules/@lydell/node-pty*/**/*',
]

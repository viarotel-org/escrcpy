// ── Shell Command Blocklist ──────────────────────────────────────────────

/**
 * Dangerous command patterns that should be blocked by default.
 * Each entry is a regex tested against the full command string.
 */
const DANGEROUS_PATTERNS: Array<{ pattern: RegExp, reason: string }> = [
  { pattern: /\breboot\b/, reason: 'Device reboot' },
  { pattern: /\bshutdown\b/, reason: 'Device shutdown' },
  { pattern: /\bformat\b/, reason: 'Disk format' },
  { pattern: /\bsu\b/, reason: 'Root shell' },
]

/** Check if SHELL_READONLY mode is enabled. */
function isReadOnlyMode(): boolean {
  return process.env.SHELL_READONLY === 'true'
    || process.env.MADB_SHELL_READONLY === 'true'
}

/** Check if SHELL_UNSAFE mode is enabled (bypasses dangerous pattern checks). */
function isUnsafeMode(): boolean {
  return process.env.SHELL_UNSAFE === 'true'
    || process.env.MADB_SHELL_UNSAFE === 'true'
}

/**
 * Allowed command prefixes when in read-only mode.
 * Only commands that retrieve information without side effects.
 */
const READONLY_PREFIXES = [
  'getprop',
  'dumpsys',
  'settings get',
  'pm list',
  'pm path',
  'pm dump',
  'am stack list',
  'wm size',
  'wm density',
  'cat',
  'ls',
  'pwd',
  'id',
  'which',
  'echo',
  'uiautomator dump',
  'screencap',
  'service call clipboard 2',
  'ime list',
  'cmd package list',
  'cmd package resolve',
  'content query',
  'input keyevent',
  'logcat',
  'df',
  'top',
  'ps',
  'date',
  'uname',
  'getenforce',
]

/**
 * Validate a shell command against security policies.
 *
 * @throws Error if the command is blocked.
 */
export function validateShellCommand(command: string): void {
  const trimmed = command.trim()
  if (!trimmed) {
    throw new Error('Empty shell command')
  }

  // Read-only mode: only allow whitelisted command prefixes
  if (isReadOnlyMode()) {
    const allowed = READONLY_PREFIXES.some(prefix =>
      trimmed.toLowerCase().startsWith(prefix.toLowerCase()),
    )
    if (!allowed) {
      throw new Error(
        `Command blocked: read-only mode is enabled (SHELL_READONLY=true). `
        + `Allowed commands: ${READONLY_PREFIXES.slice(0, 10).join(', ')}, ...`,
      )
    }
  }

  // Check against dangerous patterns
  if (!isUnsafeMode()) {
    for (const { pattern, reason } of DANGEROUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        throw new Error(
          `Command blocked: ${reason}. `
          + `Override with SHELL_UNSAFE=true to bypass (not recommended).`,
        )
      }
    }
  }
}

// ── Path Validation ──────────────────────────────────────────────────────

/**
 * Allowed path prefixes on the Android device.
 * Prevents reading/writing sensitive system areas.
 */
const SAFE_DEVICE_PREFIXES = [
  '/sdcard/',
  '/storage/',
  '/data/local/tmp/',
  '/data/media/',
  '/mnt/',
]

/**
 * Resolve and normalize a local host path, ensuring it stays within
 * the allowed directory.
 *
 * @param filePath - The path to validate.
 * @param allowedDir - The root directory the path must be under. Defaults to ALLOWED_DIR or MADB_ALLOWED_DIR.
 * @returns The resolved absolute path.
 * @throws Error if the path escapes the allowed directory.
 */
export async function validateLocalPath(filePath: string, allowedDir?: string): Promise<string> {
  const path = await import('node:path')
  const root = allowedDir || process.env.ALLOWED_DIR || process.env.MADB_ALLOWED_DIR || ''
  const resolved = path.resolve(filePath)

  if (root) {
    const resolvedRoot = path.resolve(root)
    if (!resolved.startsWith(resolvedRoot + path.sep) && resolved !== resolvedRoot) {
      throw new Error(
        `Path "${filePath}" is outside the allowed directory "${resolvedRoot}". `
        + `Set ALLOWED_DIR to change the allowed root.`,
      )
    }
  }

  return resolved
}

/**
 * Validate a device path to ensure it's under a safe prefix.
 *
 * @param devicePath - The path on the Android device.
 * @returns The normalized path.
 * @throws Error if the path is outside safe device directories.
 */
export function validateDevicePath(devicePath: string): string {
  const normalized = `/${devicePath.replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/')}`

  const isSafe = SAFE_DEVICE_PREFIXES.some(prefix =>
    normalized.startsWith(prefix) || normalized === prefix.replace(/\/$/, ''),
  )

  if (!isSafe) {
    throw new Error(
      `Device path "${devicePath}" is outside safe directories: ${SAFE_DEVICE_PREFIXES.join(', ')}. `
      + `Use paths under /sdcard/, /storage/, /data/local/tmp/, or /data/media/.`,
    )
  }

  return normalized
}

// ── Shell Escape Helpers ─────────────────────────────────────────────────

/**
 * Escape a string for safe use in a single-quoted shell argument.
 */
export function shellEscape(value: string): string {
  return value.replace(/'/g, `'\\''`)
}

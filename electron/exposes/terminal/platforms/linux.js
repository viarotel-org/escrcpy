import { exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

/**
 * Escape shell arguments for Linux
 * @param {string} arg - Argument to escape
 * @returns {string} - Escaped argument
 */
function escapeShellArg(arg) {
  return `'${arg.replace(/'/g, '\'\\\'\'')}'`
}

/**
 * Build environment variable string
 * @param {Object} env - Environment variables
 * @returns {string} - Environment string
 */
function buildEnvString(env = {}) {
  return Object.entries(env)
    .map(([key, value]) => `${key}=${escapeShellArg(String(value))}`)
    .join(' ')
}

/**
 * Check if a command exists
 * @param {string} command - Command name
 * @returns {Promise<boolean>}
 */
async function commandExists(command) {
  try {
    await execAsync(`which ${command}`)
    return true
  }
  catch {
    return false
  }
}

/**
 * Open gnome-terminal
 * @param {Object} options - Options
 * @returns {Promise<void>}
 */
async function openGnomeTerminal(options = {}) {
  const { env = {}, cwd = process.cwd(), command = '' } = options

  const envString = buildEnvString(env)
  const fullCommand = command || '$SHELL'

  const args = [
    '--working-directory', cwd,
    '--',
  ]

  // Use bash to set environment and execute command
  const bashCommand = `${envString} ${fullCommand}`

  spawn('gnome-terminal', [...args, 'bash', '-c', bashCommand], {
    detached: true,
    stdio: 'ignore',
  }).unref()
}

/**
 * Open konsole
 * @param {Object} options - Options
 * @returns {Promise<void>}
 */
async function openKonsole(options = {}) {
  const { env = {}, cwd = process.cwd(), command = '' } = options

  const envString = buildEnvString(env)
  const fullCommand = command || '$SHELL'

  const bashCommand = `${envString} ${fullCommand}`

  spawn('konsole', [
    '--workdir', cwd,
    '-e', 'bash', '-c', bashCommand,
  ], {
    detached: true,
    stdio: 'ignore',
  }).unref()
}

/**
 * Open xterm
 * @param {Object} options - Options
 * @returns {Promise<void>}
 */
async function openXterm(options = {}) {
  const { env = {}, cwd = process.cwd(), command = '' } = options

  const envString = buildEnvString(env)
  const fullCommand = command || '$SHELL'

  const bashCommand = `cd ${escapeShellArg(cwd)}; ${envString} ${fullCommand}`

  spawn('xterm', ['-e', 'bash', '-c', bashCommand], {
    detached: true,
    stdio: 'ignore',
  }).unref()
}

/**
 * Open x-terminal-emulator (Debian/Ubuntu default)
 * @param {Object} options - Options
 * @returns {Promise<void>}
 */
async function openXTerminalEmulator(options = {}) {
  const { env = {}, cwd = process.cwd(), command = '' } = options

  const envString = buildEnvString(env)
  const fullCommand = command || '$SHELL'

  const bashCommand = `cd ${escapeShellArg(cwd)}; ${envString} ${fullCommand}`

  spawn('x-terminal-emulator', ['-e', 'bash', '-c', bashCommand], {
    detached: true,
    stdio: 'ignore',
  }).unref()
}

/**
 * Open system terminal on Linux
 * @param {Object} options - Options
 * @param {Object} options.env - Environment variables to inject
 * @param {string} options.cwd - Working directory
 * @param {string} options.command - Command to execute
 * @param {string} options.preferredTerminal - Preferred terminal
 * @returns {Promise<void>}
 */
export async function openSystemTerminal(options = {}) {
  const { preferredTerminal } = options

  // Terminal priority list
  const terminals = [
    { name: 'gnome-terminal', handler: openGnomeTerminal },
    { name: 'konsole', handler: openKonsole },
    { name: 'x-terminal-emulator', handler: openXTerminalEmulator },
    { name: 'xterm', handler: openXterm },
  ]

  // If preferred terminal is specified, try it first
  if (preferredTerminal) {
    const preferred = terminals.find(t => t.name === preferredTerminal)
    if (preferred && await commandExists(preferred.name)) {
      await preferred.handler(options)
      return
    }
  }

  // Try terminals in order
  for (const terminal of terminals) {
    if (await commandExists(terminal.name)) {
      await terminal.handler(options)
      return
    }
  }

  throw new Error('No suitable terminal emulator found on this system')
}

/**
 * Get available terminals on Linux
 * @returns {Promise<Array>}
 */
export async function getAvailableTerminals() {
  const terminalNames = ['gnome-terminal', 'konsole', 'x-terminal-emulator', 'xterm']
  const terminals = []

  for (const name of terminalNames) {
    if (await commandExists(name)) {
      terminals.push({ name, displayName: name, available: true })
    }
  }

  return terminals
}

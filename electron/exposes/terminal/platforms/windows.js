import { exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'

const execAsync = promisify(exec)

/**
 * Escape PowerShell arguments
 * @param {string} arg - Argument to escape
 * @returns {string} - Escaped argument
 */
function escapePowerShellArg(arg) {
  return `'${arg.replace(/'/g, '\'\'')}'`
}

/**
 * Build environment variable commands for CMD (only key variables)
 * @param {Object} env - Environment variables
 * @returns {string} - Environment commands
 */
function buildCmdEnv(env = {}) {
  const commands = []

  // Set PATH if it exists and is different from system PATH
  if (env.PATH) {
    commands.push(`set "PATH=${env.PATH}"`)
  }

  // Set custom tool paths
  if (env.ADB) {
    commands.push(`set "ADB=${env.ADB}"`)
  }
  if (env.SCRCPY) {
    commands.push(`set "SCRCPY=${env.SCRCPY}"`)
  }
  if (env.GNIREHTET) {
    commands.push(`set "GNIREHTET=${env.GNIREHTET}"`)
  }

  return commands.join('\n')
}

/**
 * Check if Windows Terminal is available
 * @returns {Promise<boolean>}
 */
async function hasWindowsTerminal() {
  try {
    await execAsync('where wt.exe')
    return true
  }
  catch {
    return false
  }
}

/**
 * Check if PowerShell is available
 * @returns {Promise<boolean>}
 */
async function hasPowerShell() {
  try {
    await execAsync('where powershell.exe')
    return true
  }
  catch {
    return false
  }
}

/**
 * Open Windows Terminal
 * @param {Object} options - Options
 * @returns {Promise<void>}
 */
async function openWindowsTerminal(options = {}) {
  const { env = {}, cwd = process.cwd(), command = '' } = options

  // Build PowerShell command to change directory and execute user command
  const cdCommand = `cd ${escapePowerShellArg(cwd)}`
  const fullCommand = command ? `${cdCommand}; ${command}` : cdCommand

  // Windows Terminal supports PowerShell by default
  // Use env option to pass environment variables instead of command string
  spawn('wt.exe', ['-d', cwd, 'powershell.exe', '-NoExit', '-Command', fullCommand], {
    detached: true,
    stdio: 'ignore',
    env, // Pass environment variables directly
  }).unref()
}

/**
 * Open PowerShell
 * @param {Object} options - Options
 * @returns {Promise<void>}
 */
async function openPowerShell(options = {}) {
  const { env = {}, cwd = process.cwd(), command = '' } = options

  // Build PowerShell command to change directory and execute user command
  const cdCommand = `cd ${escapePowerShellArg(cwd)}`
  const fullCommand = command ? `${cdCommand}; ${command}` : cdCommand

  // Use env option to pass environment variables instead of command string
  spawn('powershell.exe', ['-NoExit', '-Command', fullCommand], {
    detached: true,
    stdio: 'ignore',
    cwd,
    env, // Pass environment variables directly
  }).unref()
}

/**
 * Open CMD
 * @param {Object} options - Options
 * @returns {Promise<void>}
 */
async function openCmd(options = {}) {
  const { env = {}, cwd = process.cwd(), command = '' } = options

  // Create a batch file for CMD
  const tmpDir = os.tmpdir()
  const batchPath = path.join(tmpDir, `escrcpy-terminal-${Date.now()}.bat`)

  // Build environment variable commands (only key variables)
  const envCommands = buildCmdEnv(env)

  // Build batch file content
  // Use chcp 65001 to set UTF-8 encoding
  // Use quotes around path to handle spaces
  const batchContent = `@echo off
chcp 65001 >nul
${envCommands}
cd /d "${cwd}"
${command}
cmd /k
`

  await fs.writeFile(batchPath, batchContent, 'utf8')

  // Use start command to open a new CMD window
  // Quote the batch path to handle spaces
  spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', `"${batchPath}"`], {
    detached: true,
    stdio: 'ignore',
  }).unref()

  // Clean up batch file after a delay
  setTimeout(() => {
    fs.remove(batchPath).catch(() => {})
  }, 5000)
}

/**
 * Open system terminal on Windows
 * @param {Object} options - Options
 * @param {Object} options.env - Environment variables to inject
 * @param {string} options.cwd - Working directory
 * @param {string} options.command - Command to execute
 * @param {string} options.preferredTerminal - Preferred terminal (WindowsTerminal, PowerShell, CMD)
 * @returns {Promise<void>}
 */
export async function openSystemTerminal(options = {}) {
  const { preferredTerminal = 'WindowsTerminal' } = options

  // Try preferred terminal first
  if (preferredTerminal === 'WindowsTerminal' && await hasWindowsTerminal()) {
    await openWindowsTerminal(options)
    return
  }

  if (preferredTerminal === 'PowerShell' && await hasPowerShell()) {
    await openPowerShell(options)
    return
  }

  // Fallback logic
  if (await hasWindowsTerminal()) {
    await openWindowsTerminal(options)
  }
  else if (await hasPowerShell()) {
    await openPowerShell(options)
  }
  else {
    await openCmd(options)
  }
}

/**
 * Get available terminals on Windows
 * @returns {Promise<Array>}
 */
export async function getAvailableTerminals() {
  const terminals = [
    { name: 'WindowsTerminal', displayName: 'Windows Terminal', available: await hasWindowsTerminal() },
    { name: 'PowerShell', displayName: 'PowerShell', available: await hasPowerShell() },
    { name: 'CMD', displayName: 'Command Prompt', available: true },
  ]

  return terminals.filter(t => t.available)
}

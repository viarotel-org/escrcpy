import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'

const execAsync = promisify(exec)

/**
 * Escape shell arguments for macOS
 * @param {string} arg - Argument to escape
 * @returns {string} - Escaped argument
 */
function escapeShellArg(arg) {
  return `'${arg.replace(/'/g, '\'\\\'\'')}'`
}

/**
 * Build environment variable export commands
 * @param {Object} env - Environment variables
 * @returns {string} - Export commands
 */
function buildEnvExports(env = {}) {
  return Object.entries(env)
    .map(([key, value]) => `export ${key}=${escapeShellArg(String(value))}`)
    .join('; ')
}

/**
 * Check if a terminal application exists
 * @param {string} appName - Application name
 * @returns {Promise<boolean>}
 */
async function checkTerminalExists(appName) {
  try {
    await execAsync(`mdfind "kMDItemKind == 'Application' && kMDItemFSName == '${appName}.app'"`)
    return true
  }
  catch {
    return false
  }
}

/**
 * Open Terminal.app with environment variables
 * @param {Object} options - Options
 * @returns {Promise<void>}
 */
async function openTerminalApp(options = {}) {
  const { env = {}, cwd = process.cwd(), command = '' } = options

  // Create a temporary script file
  const tmpDir = os.tmpdir()
  const scriptPath = path.join(tmpDir, `escrcpy-terminal-${Date.now()}.sh`)

  const envExports = buildEnvExports(env)
  const cdCommand = `cd ${escapeShellArg(cwd)}`

  const scriptContent = `#!/bin/bash
${envExports}
${cdCommand}
${command}
exec $SHELL
`

  await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 })

  // Open Terminal.app with the script
  const appleScript = `
tell application "Terminal"
    activate
    do script "bash ${escapeShellArg(scriptPath)}; rm -f ${escapeShellArg(scriptPath)}"
end tell
`

  await execAsync(`osascript -e ${escapeShellArg(appleScript)}`)
}

/**
 * Open iTerm2 with environment variables
 * @param {Object} options - Options
 * @returns {Promise<void>}
 */
async function openITerm2(options = {}) {
  const { env = {}, cwd = process.cwd(), command = '' } = options

  const envExports = buildEnvExports(env)
  const cdCommand = `cd ${escapeShellArg(cwd)}`

  const fullCommand = [envExports, cdCommand, command].filter(Boolean).join('; ')

  const appleScript = `
tell application "iTerm"
    activate
    create window with default profile
    tell current session of current window
        write text "${fullCommand.replace(/"/g, '\\"')}"
    end tell
end tell
`

  await execAsync(`osascript -e ${escapeShellArg(appleScript)}`)
}

/**
 * Open system terminal on macOS
 * @param {Object} options - Options
 * @param {Object} options.env - Environment variables to inject
 * @param {string} options.cwd - Working directory
 * @param {string} options.command - Command to execute
 * @param {string} options.preferredTerminal - Preferred terminal (Terminal, iTerm)
 * @returns {Promise<void>}
 */
export async function openSystemTerminal(options = {}) {
  const { preferredTerminal = 'Terminal' } = options

  // Try preferred terminal first
  if (preferredTerminal === 'iTerm') {
    const hasITerm = await checkTerminalExists('iTerm')
    if (hasITerm) {
      await openITerm2(options)
      return
    }
  }

  // Fallback to Terminal.app
  await openTerminalApp(options)
}

/**
 * Get available terminals on macOS
 * @returns {Promise<Array>}
 */
export async function getAvailableTerminals() {
  const terminals = [
    { name: 'Terminal', displayName: 'Terminal.app', available: true },
    { name: 'iTerm', displayName: 'iTerm2', available: await checkTerminalExists('iTerm') },
  ]

  return terminals.filter(t => t.available)
}

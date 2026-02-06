import { spawn as ptySpawn } from '@lydell/node-pty'
import { homedir } from 'node:os'
import fs from 'node:fs'
import { BaseTerminalProvider } from './base.js'

export class LocalTerminalProvider extends BaseTerminalProvider {
  /**
   * @param {Object} config
   * @param {string} config.instanceId
   * @param {Object} config.callbacks
   */
  constructor(config) {
    super(config)
    this.pty = null
    this._resizeTimer = null
    this.isAlive = false
    this._onData = this._onData.bind(this)
    this._onExit = this._onExit.bind(this)
  }

  /**
   * Spawn local terminal
   * @param {Object} options
   * @param {string} [options.shell] - Shell path (auto-detected)
   * @param {string} [options.cwd] - Working directory
   * @param {Object} [options.env] - Environment variables
   * @param {number} [options.cols] - Columns
   * @param {number} [options.rows] - Rows
   */
  async spawn(options = {}) {
    const {
      shell = this._detectShell(),
      cwd = options.cwd || homedir(),
      env = { ...process.env, ...options.env },
      cols = 90,
      rows = 24,
    } = options

    const isWindows = process.platform === 'win32'

    const shellArgs = isWindows ? ['-NoLogo'] : []

    const enhancedEnv = {
      ...env,
      TERM: env.TERM || 'xterm-256color',
      COLORTERM: env.COLORTERM || 'truecolor',
      PYTHONIOENCODING: env.PYTHONIOENCODING || 'utf-8',
      LANG: env.LANG || 'en_US.UTF-8',
    }

    try {
      const ptyOptions = {
        name: 'xterm-256color',
        cols,
        rows,
        cwd,
        env: enhancedEnv,
      }

      if (isWindows) {
        ptyOptions.useConpty = true
        ptyOptions.conptyInheritCursor = true
      }
      else {
        ptyOptions.encoding = 'utf8'
      }

      this.pty = ptySpawn(shell, shellArgs, ptyOptions)
      this.isAlive = true

      this.pty.onData(this._onData)
      this.pty.onExit(this._onExit)

      console.log(`[LocalTerminal] Spawned: ${shell} (${this.instanceId})`)
    }
    catch (error) {
      this._emitError({
        message: error.message,
        code: 'SPAWN_ERROR',
      })
      throw error
    }
  }

  /** @private */
  _onData(data) {
    this._emitData(data)
  }

  /** @private */
  _onExit({ exitCode, signal }) {
    this._emitExit(exitCode, signal)
    this.isAlive = false
  }

  /**
   * Write data
   * @param {string} data
   * @returns {boolean} Whether the write was successful
   */
  write(data) {
    if (!this.pty || !this.isAlive) {
      console.warn('[LocalTerminal] Cannot write: PTY not alive')
      return false
    }
    this.pty.write(data)
    return true
  }

  /**
   * Resize terminal (with debounce optimization)
   * @param {number} cols
   * @param {number} rows
   */
  resize(cols, rows) {
    if (!this.pty || !this.isAlive) {
      console.warn('[LocalTerminal] Cannot resize: PTY not alive')
      return
    }

    clearTimeout(this._resizeTimer)
    this._resizeTimer = setTimeout(() => {
      if (this.pty && this.isAlive) {
        this.pty.resize(cols, rows)
      }
    }, 16)
  }

  /**
   * Destroy terminal
   */
  async destroy() {
    if (!this.pty)
      return

    try {
      this.pty.removeAllListeners()
      if (this.isAlive) {
        this.pty.kill()
        this.isAlive = false
      }
      console.log(`[LocalTerminal] Destroyed: ${this.instanceId}`)
    }
    catch (error) {
      console.error('[LocalTerminal] Destroy error:', error)
    }
    finally {
      this.pty = null
      clearTimeout(this._resizeTimer)
      this._resizeTimer = null
    }
  }

  /**
   * Detect default shell
   * @private
   * @returns {string} shell path
   */
  _detectShell() {
    const platform = process.platform
    if (platform === 'win32') {
      return process.env.SHELL || process.env.COMSPEC || 'powershell.exe'
    }

    const shells = [
      process.env.SHELL,
      '/bin/zsh',
      '/bin/bash',
      '/bin/sh',
    ].filter(Boolean)

    for (const sh of shells) {
      if (fs.existsSync(sh))
        return sh
    }

    return '/bin/sh'
  }
}

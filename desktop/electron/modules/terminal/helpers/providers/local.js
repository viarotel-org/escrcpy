import { spawn as ptySpawn } from '@lydell/node-pty'
import { homedir } from 'node:os'
import { BaseTerminalProvider } from './base.js'

/**
 * Local Terminal Provider
 * 使用 node-pty 实现本地终端能力
 */
export class LocalTerminalProvider extends BaseTerminalProvider {
  /**
   * @param {Object} config
   * @param {string} config.instanceId
   * @param {Object} config.callbacks
   */
  constructor(config) {
    super(config)
    this.pty = null
  }

  /**
   * 启动本地终端
   * @param {Object} options
   * @param {string} [options.shell] - Shell 路径（自动检测）
   * @param {string} [options.cwd] - 工作目录
   * @param {Object} [options.env] - 环境变量
   * @param {number} [options.cols] - 列数
   * @param {number} [options.rows] - 行数
   */
  async spawn(options = {}) {
    const {
      shell = this._detectShell(),
      cwd = options.cwd || homedir(),
      env = { ...process.env, ...options.env },
      cols = 80,
      rows = 24,
    } = options

    const isWindows = process.platform === 'win32'

    const shellArgs = isWindows
      ? [
          '-NoLogo',
          '-NoProfile',
          '-Command',
          // 设置纯文本输出，禁用 ANSI 转义序列
          '$PSStyle.OutputRendering = \'PlainText\'; '
          + '[Console]::InputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); '
          // 禁用 PSReadLine（完全移除输入高亮）
          + 'Remove-Module PSReadLine -ErrorAction SilentlyContinue; '
          // 进入交互模式
          + '& { while ($true) { $command = [Console]::ReadLine(); if ($command -eq "exit") { break }; Invoke-Expression $command } }',
        ]
      : []

    // 增强环境变量
    const enhancedEnv = {
      ...env,
      TERM: 'xterm-256color',
      COLORTERM: 'truecolor',
      PYTHONIOENCODING: 'utf-8',
      LANG: 'en_US.UTF-8',
    }

    try {
      // 构建 PTY 配置
      const ptyOptions = {
        name: 'xterm-256color',
        cols,
        rows,
        cwd,
        env: enhancedEnv,
      }

      // Windows ConPTY 特定配置
      if (isWindows) {
        ptyOptions.useConpty = true
        ptyOptions.conptyInheritCursor = false
        // 移除 encoding 参数以避免 "Setting encoding on Windows is not supported" 警告
      }
      else {
        ptyOptions.encoding = 'utf8'
      }

      // 使用 node-pty 创建 PTY
      this.pty = ptySpawn(shell, shellArgs, ptyOptions)

      this.isAlive = true

      // 监听数据输出
      this.pty.onData((data) => {
        this._emitData(data)
      })

      // 监听退出
      this.pty.onExit(({ exitCode, signal }) => {
        this._emitExit(exitCode, signal)
      })

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

  /**
   * 写入数据
   */
  write(data) {
    if (!this.pty || !this.isAlive) {
      console.warn('[LocalTerminal] Cannot write: PTY not alive')
      return
    }
    this.pty.write(data)
  }

  /**
   * 调整终端大小（带 debounce 优化）
   */
  resize(cols, rows) {
    if (!this.pty || !this.isAlive) {
      console.warn('[LocalTerminal] Cannot resize: PTY not alive')
      return
    }

    // Debounce resize 调用，避免频繁 resize 导致光标抖动
    clearTimeout(this._resizeTimer)
    this._resizeTimer = setTimeout(() => {
      if (this.pty && this.isAlive) {
        this.pty.resize(cols, rows)
      }
    }, 50)
  }

  /**
   * 销毁终端
   */
  async destroy() {
    if (!this.pty) {
      return
    }

    try {
      this.pty.kill()
      this.isAlive = false
      console.log(`[LocalTerminal] Destroyed: ${this.instanceId}`)
    }
    catch (error) {
      console.error('[LocalTerminal] Destroy error:', error)
    }
    finally {
      this.pty = null
    }
  }

  /**
   * 检测默认 Shell
   * @private
   */
  _detectShell() {
    const platform = process.platform

    if (platform === 'win32') {
      return process.env.SHELL || 'powershell.exe'
    }

    // macOS / Linux: 优先环境变量，回退到常见 shell
    return (
      process.env.SHELL
      || '/bin/zsh'
      || '/bin/bash'
      || '/bin/sh'
    )
  }
}

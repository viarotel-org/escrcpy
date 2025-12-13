/**
 * PTY Service - 主进程服务
 * 集中管理所有 PTY 相关逻辑
 */
import os from 'node:os'
import path from 'node:path'
import * as pty from '@lydell/node-pty'
import appStore from '$electron/helpers/store.js'
import { adbPath, gnirehtetPath, scrcpyPath } from '$electron/configs/index.js'
import { app } from 'electron'

class PTYService {
  constructor() {
    this.sessions = new Map()
    this.subscriptions = new Map()
    this._setupCleanup()
  }

  /**
   * 设置自动清理
   */
  _setupCleanup() {
    app.on('before-quit', () => {
      this.destroyAll()
    })
  }

  /**
   * 获取默认 Shell
   */
  getDefaultShell() {
    const platform = os.platform()
    if (platform === 'win32') {
      return process.env.COMSPEC || 'cmd.exe'
    }
    return process.env.SHELL || '/bin/bash'
  }

  /**
   * 构建环境变量（注入 ADB、Scrcpy、Gnirehtet 路径）
   */
  buildEnvironment(customEnv = {}) {
    const currentAdbPath = appStore.get('common.adbPath') || adbPath
    const currentScrcpyPath = appStore.get('common.scrcpyPath') || scrcpyPath
    const currentGnirehtetPath
      = appStore.get('common.gnirehtetPath') || gnirehtetPath

    const pathDirs = new Set()

    if (currentAdbPath) {
      pathDirs.add(path.dirname(currentAdbPath))
    }
    if (currentScrcpyPath) {
      pathDirs.add(path.dirname(currentScrcpyPath))
    }
    if (currentGnirehtetPath) {
      pathDirs.add(path.dirname(currentGnirehtetPath))
    }

    const existingPath = process.env.PATH || ''
    const pathSeparator = os.platform() === 'win32' ? ';' : ':'

    const newPath
      = pathDirs.size > 0
        ? [...pathDirs, existingPath].join(pathSeparator)
        : existingPath

    const env = {
      ...process.env,
      PATH: newPath,
      ...customEnv,
    }

    if (currentAdbPath)
      env.ADB = currentAdbPath
    if (currentScrcpyPath)
      env.SCRCPY = currentScrcpyPath
    if (currentGnirehtetPath)
      env.GNIREHTET = currentGnirehtetPath

    return env
  }

  /**
   * 创建 PTY 会话
   */
  createSession(options = {}) {
    const {
      shell = this.getDefaultShell(),
      cwd = os.homedir(),
      env: customEnv = {},
      cols = 80,
      rows = 24,
      id = `pty-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    } = options

    const env = this.buildEnvironment(customEnv)

    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-256color',
      cols,
      rows,
      cwd,
      env,
    })

    this.sessions.set(id, {
      id,
      ptyProcess,
      shell,
      cwd,
      cols,
      rows,
      createdAt: Date.now(),
    })

    return {
      id,
      pid: ptyProcess.pid,
      shell,
      cwd,
      cols,
      rows,
    }
  }

  /**
   * 写入数据
   */
  write(sessionId, data) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`PTY session not found: ${sessionId}`)
    }
    session.ptyProcess.write(data)
  }

  /**
   * 调整大小
   */
  resize(sessionId, cols, rows) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`PTY session not found: ${sessionId}`)
    }
    session.ptyProcess.resize(cols, rows)
    session.cols = cols
    session.rows = rows
  }

  /**
   * 订阅数据事件
   * @param {string} sessionId
   * @param {Function} callback
   * @returns {Function} unsubscribe
   */
  onData(sessionId, callback) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`PTY session not found: ${sessionId}`)
    }

    const handler = data => callback(data)
    session.ptyProcess.onData(handler)

    return () => {
      // node-pty doesn't provide direct listener removal
    }
  }

  /**
   * 订阅退出事件
   * @param {string} sessionId
   * @param {Function} callback
   * @returns {Function} unsubscribe
   */
  onExit(sessionId, callback) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`PTY session not found: ${sessionId}`)
    }

    const handler = ({ exitCode, signal }) => {
      callback(exitCode, signal)
      this.sessions.delete(sessionId)
    }

    session.ptyProcess.onExit(handler)

    return () => {
      // Cleanup handled on exit
    }
  }

  /**
   * 销毁会话
   */
  destroy(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return
    }

    try {
      session.ptyProcess.kill()
    }
    catch (error) {
      console.error(`[PTY Service] Error killing session ${sessionId}:`, error)
    }
    finally {
      this.sessions.delete(sessionId)
    }
  }

  /**
   * 获取会话信息
   */
  getSession(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return null
    }

    return {
      id: session.id,
      pid: session.ptyProcess.pid,
      shell: session.shell,
      cwd: session.cwd,
      cols: session.cols,
      rows: session.rows,
      createdAt: session.createdAt,
    }
  }

  /**
   * 列出所有会话
   */
  listSessions() {
    return Array.from(this.sessions.values()).map(session => ({
      id: session.id,
      pid: session.ptyProcess.pid,
      shell: session.shell,
      cwd: session.cwd,
      cols: session.cols,
      rows: session.rows,
      createdAt: session.createdAt,
    }))
  }

  /**
   * 销毁所有会话
   */
  destroyAll() {
    for (const sessionId of this.sessions.keys()) {
      this.destroy(sessionId)
    }
  }
}

// 单例模式
export default new PTYService()

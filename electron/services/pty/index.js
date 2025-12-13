/**
 * PTY Service - 主进程服务
 * 集中管理所有 PTY 相关逻辑，提供统一的伪终端会话管理
 *
 * 特性：
 * - 统一的会话生命周期管理
 * - 灵活的环境变量和参数配置
 * - 事件订阅机制（数据、退出）
 * - 自动清理和资源释放
 * - 支持自定义可执行文件和参数
 */
import os from 'node:os'
import path from 'node:path'
import * as pty from '@lydell/node-pty'
import appStore from '$electron/helpers/store.js'
import { adbPath, gnirehtetPath, scrcpyPath } from '$electron/configs/index.js'
import { app } from 'electron'

class PTYService {
  constructor() {
    // 会话存储：Map<sessionId, SessionInfo>
    this.sessions = new Map()
    // 事件监听器存储：Map<sessionId, EventHandlers>
    this.eventHandlers = new Map()
    // 是否启用调试日志
    this.debugMode = false

    this._setupCleanup()
  }

  /**
   * 设置自动清理
   * @private
   */
  _setupCleanup() {
    app.on('before-quit', () => {
      this._log('Application quitting, cleaning up all sessions...')
      this.destroyAll()
    })
  }

  /**
   * 内部日志方法
   * @private
   */
  _log(...args) {
    if (this.debugMode) {
      console.log('[PTY Service]', ...args)
    }
  }

  /**
   * 内部错误日志方法
   * @private
   */
  _error(...args) {
    console.error('[PTY Service]', ...args)
  }

  /**
   * 启用/禁用调试模式
   * @param {boolean} enabled - 是否启用
   */
  setDebugMode(enabled) {
    this.debugMode = enabled
  }

  /**
   * 获取默认 Shell
   * @returns {string} Shell 路径
   */
  getDefaultShell() {
    const platform = os.platform()
    if (platform === 'win32') {
      return process.env.COMSPEC || 'cmd.exe'
    }
    return process.env.SHELL || '/bin/bash'
  }

  /**
   * 构建环境变量
   * 支持注入自定义工具路径（ADB、Scrcpy、Gnirehtet）
   * 支持清理代理变量以避免依赖问题
   *
   * @param {object} options - 配置选项
   * @param {object} options.customEnv - 自定义环境变量
   * @param {boolean} options.injectToolPaths - 是否注入工具路径（默认 true）
   * @param {boolean} options.cleanProxyVars - 是否清理代理变量（默认 false）
   * @param {string[]} options.additionalPaths - 额外的 PATH 目录
   * @returns {object} 构建后的环境变量对象
   */
  buildEnvironment(options = {}) {
    const {
      customEnv = {},
      injectToolPaths = true,
      cleanProxyVars = false,
      additionalPaths = [],
    } = options

    // 基础环境变量
    const baseEnv = { ...process.env }

    // 清理代理变量（可选）
    if (cleanProxyVars) {
      const proxyVars = [
        'ALL_PROXY',
        'all_proxy',
        'HTTP_PROXY',
        'http_proxy',
        'HTTPS_PROXY',
        'https_proxy',
        'NO_PROXY',
        'no_proxy',
      ]
      proxyVars.forEach((key) => {
        delete baseEnv[key]
      })
      this._log('Proxy environment variables cleaned')
    }

    // 构建 PATH
    const pathDirs = new Set([...additionalPaths])

    if (injectToolPaths) {
      const currentAdbPath = appStore.get('common.adbPath') || adbPath
      const currentScrcpyPath = appStore.get('common.scrcpyPath') || scrcpyPath
      const currentGnirehtetPath = appStore.get('common.gnirehtetPath') || gnirehtetPath

      if (currentAdbPath) {
        pathDirs.add(path.dirname(currentAdbPath))
      }
      if (currentScrcpyPath) {
        pathDirs.add(path.dirname(currentScrcpyPath))
      }
      if (currentGnirehtetPath) {
        pathDirs.add(path.dirname(currentGnirehtetPath))
      }
    }

    const existingPath = baseEnv.PATH || ''
    const pathSeparator = os.platform() === 'win32' ? ';' : ':'

    const newPath = pathDirs.size > 0
      ? [...pathDirs, existingPath].join(pathSeparator)
      : existingPath

    // 合并环境变量
    const env = {
      ...baseEnv,
      PATH: newPath,
      ...customEnv,
    }

    // 注入工具路径环境变量（可选）
    if (injectToolPaths) {
      const currentAdbPath = appStore.get('common.adbPath') || adbPath
      const currentScrcpyPath = appStore.get('common.scrcpyPath') || scrcpyPath
      const currentGnirehtetPath = appStore.get('common.gnirehtetPath') || gnirehtetPath

      if (currentAdbPath)
        env.ADB = currentAdbPath
      if (currentScrcpyPath)
        env.SCRCPY = currentScrcpyPath
      if (currentGnirehtetPath)
        env.GNIREHTET = currentGnirehtetPath
    }

    return env
  }

  /**
   * 创建 PTY 会话（通用方法）
   *
   * @param {object} options - 会话配置
   * @param {string} options.file - 可执行文件路径（默认为 shell）
   * @param {string[]} options.args - 命令参数（默认为空数组）
   * @param {string} options.shell - Shell 路径（当 file 未指定时使用）
   * @param {string} options.cwd - 工作目录
   * @param {object} options.env - 自定义环境变量
   * @param {boolean} options.injectToolPaths - 是否注入工具路径
   * @param {boolean} options.cleanProxyVars - 是否清理代理变量
   * @param {string[]} options.additionalPaths - 额外的 PATH 目录
   * @param {number} options.cols - 终端列数
   * @param {number} options.rows - 终端行数
   * @param {string} options.id - 会话 ID（可选，自动生成）
   * @param {object} options.metadata - 附加元数据（便于追踪）
   * @returns {object} 会话信息 { id, pid, file, args, cwd }
   */
  createSession(options = {}) {
    const {
      file,
      args = [],
      shell = this.getDefaultShell(),
      cwd = os.homedir(),
      env: customEnv = {},
      injectToolPaths = true,
      cleanProxyVars = false,
      additionalPaths = [],
      cols = 80,
      rows = 24,
      id = `pty-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      metadata = {},
    } = options

    // 构建环境变量
    const env = this.buildEnvironment({
      customEnv,
      injectToolPaths,
      cleanProxyVars,
      additionalPaths,
    })

    // 确定可执行文件和参数
    const execFile = file || shell
    const execArgs = file ? args : []

    this._log(`Creating session: ${id}`)
    this._log(`  File: ${execFile}`)
    this._log(`  Args: ${JSON.stringify(execArgs)}`)
    this._log(`  CWD: ${cwd}`)

    try {
      // 创建 PTY 进程
      const ptyProcess = pty.spawn(execFile, execArgs, {
        name: 'xterm-256color',
        cols,
        rows,
        cwd,
        env,
      })

      // 存储会话信息
      const sessionInfo = {
        id,
        ptyProcess,
        file: execFile,
        args: execArgs,
        shell,
        cwd,
        cols,
        rows,
        metadata,
        createdAt: Date.now(),
      }

      this.sessions.set(id, sessionInfo)
      this.eventHandlers.set(id, { data: [], exit: [] })

      this._log(`Session created: ${id}, PID: ${ptyProcess.pid}`)

      return {
        id,
        pid: ptyProcess.pid,
        file: execFile,
        args: execArgs,
        cwd,
        cols,
        rows,
      }
    }
    catch (error) {
      this._error(`Failed to create session: ${id}`, error)
      throw error
    }
  }

  /**
   * 写入数据到会话
   * @param {string} sessionId - 会话 ID
   * @param {string} data - 要写入的数据
   */
  write(sessionId, data) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`PTY session not found: ${sessionId}`)
    }

    this._log(`Writing to session ${sessionId}: ${data.length} bytes`)
    session.ptyProcess.write(data)
  }

  /**
   * 调整会话终端大小
   * @param {string} sessionId - 会话 ID
   * @param {number} cols - 列数
   * @param {number} rows - 行数
   */
  resize(sessionId, cols, rows) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`PTY session not found: ${sessionId}`)
    }

    this._log(`Resizing session ${sessionId}: ${cols}x${rows}`)
    session.ptyProcess.resize(cols, rows)
    session.cols = cols
    session.rows = rows
  }

  /**
   * 订阅数据事件
   * @param {string} sessionId - 会话 ID
   * @param {Function} callback - 数据回调函数 (data: string) => void
   * @returns {Function} 取消订阅函数
   */
  onData(sessionId, callback) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`PTY session not found: ${sessionId}`)
    }

    const handlers = this.eventHandlers.get(sessionId)
    if (!handlers) {
      throw new Error(`Event handlers not found for session: ${sessionId}`)
    }

    // 包装回调以便追踪
    const wrappedCallback = (data) => {
      try {
        callback(data)
      }
      catch (error) {
        this._error(`Error in data callback for session ${sessionId}:`, error)
      }
    }

    // 注册到 PTY 进程
    session.ptyProcess.onData(wrappedCallback)

    // 存储回调引用
    handlers.data.push(wrappedCallback)

    this._log(`Data listener registered for session ${sessionId}`)

    // 返回取消订阅函数
    return () => {
      const index = handlers.data.indexOf(wrappedCallback)
      if (index > -1) {
        handlers.data.splice(index, 1)
      }
      this._log(`Data listener unregistered for session ${sessionId}`)
    }
  }

  /**
   * 订阅退出事件
   * @param {string} sessionId - 会话 ID
   * @param {Function} callback - 退出回调函数 (exitCode: number, signal: number) => void
   * @returns {Function} 取消订阅函数
   */
  onExit(sessionId, callback) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`PTY session not found: ${sessionId}`)
    }

    const handlers = this.eventHandlers.get(sessionId)
    if (!handlers) {
      throw new Error(`Event handlers not found for session: ${sessionId}`)
    }

    // 包装回调以便追踪和清理
    const wrappedCallback = ({ exitCode, signal }) => {
      this._log(`Session ${sessionId} exited with code ${exitCode}, signal ${signal}`)

      try {
        callback(exitCode, signal)
      }
      catch (error) {
        this._error(`Error in exit callback for session ${sessionId}:`, error)
      }

      // 自动清理会话
      this._cleanupSession(sessionId)
    }

    // 注册到 PTY 进程
    session.ptyProcess.onExit(wrappedCallback)

    // 存储回调引用
    handlers.exit.push(wrappedCallback)

    this._log(`Exit listener registered for session ${sessionId}`)

    // 返回取消订阅函数
    return () => {
      const index = handlers.exit.indexOf(wrappedCallback)
      if (index > -1) {
        handlers.exit.splice(index, 1)
      }
      this._log(`Exit listener unregistered for session ${sessionId}`)
    }
  }

  /**
   * 内部清理会话资源
   * @private
   * @param {string} sessionId - 会话 ID
   */
  _cleanupSession(sessionId) {
    this._log(`Cleaning up session: ${sessionId}`)
    this.sessions.delete(sessionId)
    this.eventHandlers.delete(sessionId)
  }

  /**
   * 销毁会话
   * @param {string} sessionId - 会话 ID
   */
  destroy(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      this._log(`Session not found, skipping destroy: ${sessionId}`)
      return
    }

    this._log(`Destroying session: ${sessionId}`)

    try {
      session.ptyProcess.kill()
    }
    catch (error) {
      this._error(`Error killing session ${sessionId}:`, error)
    }
    finally {
      this._cleanupSession(sessionId)
    }
  }

  /**
   * 获取会话信息
   * @param {string} sessionId - 会话 ID
   * @returns {object|null} 会话信息或 null
   */
  getSession(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return null
    }

    return {
      id: session.id,
      pid: session.ptyProcess.pid,
      file: session.file,
      args: session.args,
      shell: session.shell,
      cwd: session.cwd,
      cols: session.cols,
      rows: session.rows,
      metadata: session.metadata,
      createdAt: session.createdAt,
    }
  }

  /**
   * 列出所有会话
   * @returns {Array} 会话列表
   */
  listSessions() {
    return Array.from(this.sessions.values()).map(session => ({
      id: session.id,
      pid: session.ptyProcess.pid,
      file: session.file,
      args: session.args,
      shell: session.shell,
      cwd: session.cwd,
      cols: session.cols,
      rows: session.rows,
      metadata: session.metadata,
      createdAt: session.createdAt,
    }))
  }

  /**
   * 销毁所有会话
   */
  destroyAll() {
    this._log(`Destroying all sessions (${this.sessions.size} total)`)
    const sessionIds = Array.from(this.sessions.keys())
    sessionIds.forEach(sessionId => this.destroy(sessionId))
  }

  /**
   * 检查会话是否存在
   * @param {string} sessionId - 会话 ID
   * @returns {boolean} 是否存在
   */
  hasSession(sessionId) {
    return this.sessions.has(sessionId)
  }

  /**
   * 获取会话数量
   * @returns {number} 会话数量
   */
  getSessionCount() {
    return this.sessions.size
  }
}

// 导出单例
const ptyService = new PTYService()

export default ptyService

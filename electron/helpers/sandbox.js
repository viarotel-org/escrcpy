import { app } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import log from './log.js'

/**
 * 沙盒自动配置管理器
 * 自动检测 Linux 环境并在必要时禁用 Chromium 沙盒
 */
class SandboxManager {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {Object} options.fsModule - 文件系统模块
   * @param {Object} options.processModule - 进程模块
   * @param {Object} options.childProcessModule - 子进程模块
   * @param {Object} options.pathModule - 路径处理模块
   * @param {Object} options.config - 配置选项
   */
  constructor({
    fsModule = fs,
    processModule = process,
    childProcessModule = { spawnSync },
    pathModule = path,
    config = {},
  } = {}) {
    // 默认配置
    this.config = {
      cacheTimeout: 5 * 60 * 1000, // 5分钟缓存过期
      sandboxTestTimeout: 5000,
      maxPathLength: 4096,
      allowedEnvVarChars: /^[\w\-.,/:=@]+$/,
      chromeSandboxPaths: [
        'chrome-sandbox',
        '../chrome-sandbox',
        '/opt/Escrcpy/chrome-sandbox',
      ],
      ...config,
    }

    // 验证依赖模块
    this._validateDependencies({
      fsModule,
      processModule,
      childProcessModule,
      pathModule,
    })

    this.fs = fsModule
    this.process = processModule
    this.childProcess = childProcessModule
    this.path = pathModule

    // 缓存检测结果，避免重复计算
    this._detectionCache = new Map()
    this._asyncCache = new Map()
  }

  /**
   * 验证依赖模块是否有效
   * @param {Object} deps - 依赖模块
   * @throws {Error} 当依赖模块不完整时抛出错误
   */
  _validateDependencies(deps) {
    const requiredMethods = {
      fsModule: ['existsSync', 'statSync', 'readFileSync'],
      processModule: ['platform', 'env'], // getuid 是可选的
      childProcessModule: ['spawnSync'],
      pathModule: ['join', 'resolve', 'normalize'],
    }

    const optionalMethods = {
      processModule: ['getuid'], // 在某些环境下可能不存在
    }

    // 验证必需方法
    for (const [moduleName, methods] of Object.entries(requiredMethods)) {
      const module = deps[moduleName]
      if (!module) {
        throw new Error(`Missing required module: ${moduleName}`)
      }

      for (const method of methods) {
        if (typeof module[method] !== 'function' && !(method in module)) {
          throw new TypeError(`Module ${moduleName} is missing required method: ${method}`)
        }
      }
    }

    // 验证可选方法（仅记录警告）
    for (const [moduleName, methods] of Object.entries(optionalMethods)) {
      const module = deps[moduleName]
      if (module) {
        for (const method of methods) {
          if (typeof module[method] !== 'function') {
            log.debug(`Optional method ${method} not available in ${moduleName}`)
          }
        }
      }
    }
  }

  /**
   * 自动检测环境并配置沙盒
   * @returns {Promise<{disabled: boolean, reason: string, checks?: Object}>} 配置结果
   */
  async configureSandbox() {
    const startTime = Date.now()

    // 非 Linux 平台直接返回
    if (this.process.platform !== 'linux') {
      log.debug('Not running on Linux, skipping sandbox configuration')
      return {
        disabled: false,
        reason: 'Not applicable on non-Linux platforms',
        checks: { platform: 'non-linux' },
      }
    }

    let shouldDisable = false
    let reason = ''
    const checkResults = {}

    try {
      // 优先读取强制禁用环境变量
      const forceDisable = this.sanitizeEnvVar(this.process.env.FORCE_NO_SANDBOX) === '1'
      const forceEnable = this.sanitizeEnvVar(this.process.env.FORCE_SANDBOX) === '1'

      checkResults.forceDisable = forceDisable
      checkResults.forceEnable = forceEnable

      if (forceDisable && forceEnable) {
        log.warn('Both FORCE_NO_SANDBOX and FORCE_SANDBOX are set, prioritizing FORCE_NO_SANDBOX')
      }

      if (forceDisable) {
        shouldDisable = true
        reason = 'FORCE_NO_SANDBOX=1'
      }
      // 如果强制启用沙盒，跳过所有检测
      else if (!forceEnable) {
        // 先检查沙盒功能性
        const isSandboxFunctional = await this.isSandboxFunctional()
        checkResults.sandboxFunctional = isSandboxFunctional

        // 定义检测项目（同步检测）
        const syncChecks = [
          { name: 'wayland', check: () => this.isWaylandSession(), reason: 'Running in pure Wayland session' },
          { name: 'container', check: () => this.isRunningInContainer() && !this.isPrivilegedContainer(), reason: 'Running in non-privileged container environment' },
          { name: 'packaging', check: () => this.isProblematicEnvironment(), reason: 'Running in special packaging environment' },
          { name: 'wsl', check: () => this.isWsl(), reason: 'Running in WSL environment' },
          { name: 'permissions', check: () => !this.checkChromeSandboxPermissions(), reason: 'Chrome sandbox permissions issue' },
        ]

        // 特殊处理 root 用户检测（需要结合沙盒功能性）
        const isRoot = this.isRunningAsRoot()
        checkResults.isRoot = isRoot
        if (isRoot && !isSandboxFunctional) {
          shouldDisable = true
          reason = 'Running as root user with non-functional sandbox'
          checkResults.rootWithNonFunctionalSandbox = true
        }

        // 如果还没有决定禁用，继续其他检测
        if (!shouldDisable) {
          for (const { name, check, reason: checkReason } of syncChecks) {
            try {
              const result = check()
              checkResults[name] = result
              if (result) {
                shouldDisable = true
                reason = checkReason
                log.debug(`Sandbox disabled due to: ${name}`)
                break
              }
            }
            catch (error) {
              log.error(`Error during ${name} check:`, error.message)
              checkResults[`${name}Error`] = error.message
              // 单个检测失败不应阻止其他检测
              continue
            }
          }
        }
      }

      // 应用配置
      if (shouldDisable) {
        app.commandLine.appendSwitch('no-sandbox')
        app.commandLine.appendSwitch('disable-dev-shm-usage')
        log.warn(`Disabling Chromium sandbox: ${reason}`)
      }
      else {
        log.info('Chromium sandbox enabled')
      }

      const duration = Date.now() - startTime
      log.debug(`Sandbox configuration completed in ${duration}ms`)

      return {
        disabled: shouldDisable,
        reason,
        checks: checkResults,
        duration,
      }
    }
    catch (error) {
      log.error('Critical error during sandbox configuration:', error.message)
      // 出现严重错误时，为了安全起见禁用沙盒
      app.commandLine.appendSwitch('no-sandbox')
      app.commandLine.appendSwitch('disable-dev-shm-usage')

      return {
        disabled: true,
        reason: `Configuration error: ${error.message}`,
        checks: checkResults,
        error: true,
      }
    }
  }

  /**
   * 检查是否以 root 用户运行
   * @returns {boolean} 是否为 root 用户
   */
  isRunningAsRoot() {
    return this._getCachedResult('isRunningAsRoot', () => {
      try {
        // 检查 getuid 方法是否存在
        if (typeof this.process.getuid !== 'function') {
          log.debug('getuid method not available, checking alternative methods')

          // 备用方法：检查环境变量
          const user = this.sanitizeEnvVar(this.process.env.USER)
          const logname = this.sanitizeEnvVar(this.process.env.LOGNAME)

          if (user === 'root' || logname === 'root') {
            log.debug('Root detected via environment variables')
            return true
          }

          // 备用方法：检查 /proc/self/status
          if (this.fs.existsSync('/proc/self/status')) {
            const status = this.readCgroupFile('/proc/self/status')
            const uidMatch = status.match(/^Uid:\s+(\d+)/m)
            if (uidMatch && uidMatch[1] === '0') {
              log.debug('Root detected via /proc/self/status')
              return true
            }
          }

          return false
        }

        const uid = this.process.getuid()
        const isRoot = uid === 0

        if (isRoot) {
          log.debug('Root user detected via getuid()')
        }

        return isRoot
      }
      catch (error) {
        log.error('Error checking root status:', error.message)
        // 在错误情况下，保守地假设不是 root 用户
        return false
      }
    })
  }

  /**
   * 检查是否在 Wayland 会话中（排除兼容模式）
   * @returns {boolean} 是否为纯 Wayland 会话
   */
  isWaylandSession() {
    return this._getCachedResult('isWaylandSession', () => {
      const xdgSessionType = this.sanitizeEnvVar(this.process.env.XDG_SESSION_TYPE)
      const gdkBackend = this.sanitizeEnvVar(this.process.env.GDK_BACKEND)
      const waylandDisplay = this.sanitizeEnvVar(this.process.env.WAYLAND_DISPLAY)

      // 检查是否为纯 Wayland 会话（不包含混合模式）
      const isPureWaylandSession = xdgSessionType === 'wayland' && !xdgSessionType.includes('x11')
      const isPureWaylandBackend = gdkBackend === 'wayland' && !gdkBackend.includes('x11')
      const hasWaylandDisplay = !!waylandDisplay && !this.process.env.DISPLAY

      return isPureWaylandSession || isPureWaylandBackend || hasWaylandDisplay
    })
  }

  /**
   * 检查是否在容器环境中
   * @returns {boolean} 是否在容器中
   */
  isRunningInContainer() {
    return this._getCachedResult('isRunningInContainer', () => {
      try {
        // 检查 Docker 环境标识
        if (this.fs.existsSync('/.dockerenv')) {
          log.debug('Container detected: .dockerenv file exists')
          return true
        }

        // 检查环境变量
        const containerEnv = this.sanitizeEnvVar(this.process.env.container)
        const dockerContainerEnv = this.sanitizeEnvVar(this.process.env.DOCKER_CONTAINER)
        if (containerEnv || dockerContainerEnv) {
          log.debug('Container detected: container environment variables')
          return true
        }

        // 检查 Kubernetes 环境
        if (this.process.env.KUBERNETES_SERVICE_HOST) {
          log.debug('Container detected: Kubernetes environment')
          return true
        }

        // 检查 LXC 容器
        if (this.isLxcContainer()) {
          log.debug('Container detected: LXC container')
          return true
        }

        // 检查 cgroup 信息
        if (this.fs.existsSync('/proc/1/cgroup')) {
          const content = this.readCgroupFile('/proc/1/cgroup')
          if (content && this._isContainerCgroup(content)) {
            log.debug('Container detected: cgroup analysis')
            return true
          }
        }

        return false
      }
      catch (error) {
        log.error('Error checking container status:', error.message)
        return false
      }
    })
  }

  /**
   * 检查 cgroup 内容是否表明在容器中
   * @param {string} content - cgroup 文件内容
   * @returns {boolean} 是否在容器中
   */
  _isContainerCgroup(content) {
    if (!content || typeof content !== 'string') {
      return false
    }

    // 更精确的容器检测模式
    const containerPatterns = [
      /\/docker\/[a-f0-9]{64}/, // Docker 容器 ID
      /\/lxc\/[\w\-]+/, // LXC 容器
      /\/kubepods\/[^/]+\/pod[a-f0-9\-]+/, // Kubernetes pods
      /\/system\.slice\/docker-[a-f0-9]+\.scope/, // systemd Docker
    ]

    return containerPatterns.some(pattern => pattern.test(content))
  }

  /**
   * 检查是否为 LXC/LXD 容器
   * @returns {boolean} 是否为 LXC/LXD 容器
   */
  isLxcContainer() {
    return this._getCachedResult('isLxcContainer', () => {
      try {
        // 检查 LXD socket
        if (this.fs.existsSync('/dev/lxd/sock')) {
          log.debug('LXC container detected: LXD socket exists')
          return true
        }

        // 检查 LXC 环境文件
        if (this.fs.existsSync('/run/systemd/container')) {
          const containerInfo = this.readCgroupFile('/run/systemd/container')
          if (containerInfo && containerInfo.includes('lxc')) {
            log.debug('LXC container detected: systemd container file')
            return true
          }
        }

        // 检查 cgroup 信息
        if (this.fs.existsSync('/proc/1/cgroup')) {
          const content = this.readCgroupFile('/proc/1/cgroup')
          if (content && content.trim() && /\/lxc\/[\w\-]+/.test(content)) {
            log.debug('LXC container detected: cgroup analysis')
            return true
          }
        }

        return false
      }
      catch (error) {
        log.error('Error checking LXC container status:', error.message)
        return false
      }
    })
  }

  /**
   * 检查容器是否为特权模式
   * @returns {boolean} 是否为特权容器
   */
  isPrivilegedContainer() {
    return this._getCachedResult('isPrivilegedContainer', () => {
      try {
        if (this.fs.existsSync('/proc/self/status')) {
          const status = this.fs.readFileSync('/proc/self/status', 'utf8')
          const capEffMatch = status.match(/CapEff:\s+([0-9a-fA-F]+)/)
          if (capEffMatch) {
            const capEff = capEffMatch[1].toLowerCase()
            // 检查 32 位和 64 位系统的完整 capabilities
            // 32 位: ffffffff, 64 位: ffffffffffffffff
            if (capEff === 'ffffffff' || capEff === 'ffffffffffffffff') {
              return true
            }
          }
        }

        if (this.process.env.KUBERNETES_PRIVILEGED === 'true')
          return true

        return false
      }
      catch (error) {
        log.debug('Error checking privileged container status:', error.message)
        return false
      }
    })
  }

  /**
   * 检查是否在特殊打包环境中
   * @returns {boolean} 是否在特殊打包环境
   */
  isProblematicEnvironment() {
    return this._getCachedResult('isProblematicEnvironment', () => {
      return !!(this.process.env.SNAP || this.process.env.FLATPAK_ID || this.process.env.APPIMAGE)
    })
  }

  /**
   * 检查是否为 WSL 环境
   * @returns {boolean} 是否为 WSL 环境
   */
  isWsl() {
    return this._getCachedResult('isWsl', () => {
      try {
        if (this.fs.existsSync('/proc/sys/fs/binfmt_misc/WSLInterop'))
          return true
        if (this.process.env.WSL_DISTRO_NAME)
          return true
        return false
      }
      catch (error) {
        log.debug('Error checking WSL status:', error.message)
        return false
      }
    })
  }

  /**
   * 检查 chrome-sandbox 文件的权限是否正确
   * @returns {boolean} 权限是否正确
   */
  checkChromeSandboxPermissions() {
    return this._getCachedResult('checkChromeSandboxPermissions', () => {
      const basePaths = [
        this.path.join(this.process.resourcesPath || '', 'chrome-sandbox'),
        this.path.join(app.getAppPath(), 'chrome-sandbox'),
        this.path.join(this.process.execPath, '..', 'chrome-sandbox'),
        ...this.config.chromeSandboxPaths.map(p =>
          p.startsWith('/') ? p : this.path.join(this.process.cwd(), p),
        ),
      ]

      const packagePaths = []
      const flatpakId = this.sanitizeEnvVar(this.process.env.FLATPAK_ID)
      if (flatpakId) {
        const flatpakPath = this.path.join(
          '/var/lib/flatpak/app',
          flatpakId,
          'current/active/files/chrome-sandbox',
        )
        packagePaths.push(flatpakPath)
      }

      const snapPath = this.sanitizeEnvVar(this.process.env.SNAP)
      if (snapPath) {
        packagePaths.push(this.path.join(snapPath, 'chrome-sandbox'))
      }

      // 处理自定义路径，增强安全性
      const customPaths = []
      const customPathsEnv = this.sanitizeEnvVar(this.process.env.CUSTOM_CHROME_SANDBOX_PATHS)
      if (customPathsEnv) {
        const paths = customPathsEnv.split(':')
          .map(p => this.sanitizePath(p))
          .filter(p => p !== null)
          .slice(0, 10) // 限制自定义路径数量
        customPaths.push(...paths)
      }

      const possiblePaths = [...basePaths, ...packagePaths, ...customPaths]
      log.debug(`Checking chrome-sandbox in ${possiblePaths.length} locations`)

      for (const sandboxPath of possiblePaths) {
        if (!sandboxPath || !this._isInputSafe(sandboxPath)) {
          continue
        }

        if (!this.fs.existsSync(sandboxPath)) {
          continue
        }

        try {
          const stats = this.fs.statSync(sandboxPath)
          if (!stats.isFile() && !stats.isSymbolicLink()) {
            continue
          }

          const fileMode = stats.mode & 0o7777
          const basePermissions = stats.mode & 0o777
          const hasSetuid = (stats.mode & 0o4000) !== 0
          const isOwnedByRoot = stats.uid === 0
          const hasCorrectPermissions = basePermissions === 0o755

          if (isOwnedByRoot && hasSetuid && hasCorrectPermissions) {
            log.info(`Found valid chrome-sandbox at: ${sandboxPath} (mode: ${fileMode.toString(8)})`)
            return true
          }
          else {
            log.debug(`Invalid chrome-sandbox at ${sandboxPath}: uid=${stats.uid}, mode=${fileMode.toString(8)}, setuid=${hasSetuid}`)
          }
        }
        catch (error) {
          log.debug(`Error checking chrome-sandbox at ${sandboxPath}:`, error.message)
          continue
        }
      }

      log.debug('No valid chrome-sandbox found in any of the expected locations')
      return false
    })
  }

  /**
   * 检测沙盒是否能正常工作
   * @returns {Promise<boolean>} 沙盒是否有效
   */
  async isSandboxFunctional() {
    return this._getCachedAsyncResult('isSandboxFunctional', async () => {
      if (this.process.platform !== 'linux') {
        return true
      }

      const sandboxInitPath = this.path.join(this.process.resourcesPath, 'sandbox-init')
      if (!this.fs.existsSync(sandboxInitPath)) {
        log.debug('sandbox-init not found at:', sandboxInitPath)

        // 使用 fallback 检查：检查用户命名空间是否可用
        try {
          if (this.fs.existsSync('/proc/sys/user/max_user_namespaces')) {
            const content = this.fs.readFileSync('/proc/sys/user/max_user_namespaces', 'utf8')
            const maxNamespaces = Number.parseInt(content.trim())
            return !Number.isNaN(maxNamespaces) && maxNamespaces > 0
          }
        }
        catch (error) {
          log.debug('Error reading max_user_namespaces:', error.message)
        }

        return false
      }

      try {
        const { status, error } = this.childProcess.spawnSync(
          sandboxInitPath,
          ['--test'],
          {
            timeout: this.config.sandboxTestTimeout,
            stdio: 'ignore',
            encoding: 'utf8',
          },
        )

        if (error) {
          log.debug('Sandbox test spawn error:', error.message)
          return false
        }

        const isWorking = status === 0
        log.debug(`Sandbox functionality test result: ${isWorking ? 'working' : 'not working'}`)
        return isWorking
      }
      catch (error) {
        log.error('Error testing sandbox functionality:', error.message)
        return false
      }
    })
  }

  /**
   * 安全读取系统文件内容
   * @param {string} filePath - 文件路径
   * @param {number} maxSize - 最大文件大小（字节）
   * @returns {string} 文件内容
   */
  readCgroupFile(filePath, maxSize = 64 * 1024) {
    if (!this._isInputSafe(filePath)) {
      log.warn('Unsafe file path for cgroup read:', filePath)
      return ''
    }

    try {
      // 检查文件是否存在且为常规文件
      if (!this.fs.existsSync(filePath)) {
        return ''
      }

      const stats = this.fs.statSync(filePath)
      if (!stats.isFile()) {
        log.debug(`Not a regular file: ${filePath}`)
        return ''
      }

      // 检查文件大小
      if (stats.size > maxSize) {
        log.warn(`File too large: ${filePath} (${stats.size} bytes)`)
        return ''
      }

      // 安全读取文件
      const content = this.fs.readFileSync(filePath, 'utf8')

      // 验证内容安全性
      if (content.includes('\0')) {
        log.warn('File contains null bytes, potentially unsafe:', filePath)
        return ''
      }

      return content.trim()
    }
    catch (error) {
      // 区分不同类型的错误
      if (error.code === 'ENOENT') {
        log.debug(`File not found: ${filePath}`)
      }
      else if (error.code === 'EACCES') {
        log.debug(`Permission denied reading file: ${filePath}`)
      }
      else {
        log.error(`Error reading file ${filePath}:`, error.message)
      }
      return ''
    }
  }

  /**
   * 清理环境变量值
   * @param {string|undefined} value - 环境变量值
   * @returns {string} 清理后的值
   */
  sanitizeEnvVar(value) {
    if (typeof value !== 'string') {
      return ''
    }

    // 检查输入安全性
    if (!this._isInputSafe(value, 1024)) {
      log.warn('Unsafe environment variable value detected, sanitizing')
      return ''
    }

    // 更严格的环境变量验证
    if (!this.config.allowedEnvVarChars.test(value)) {
      log.debug('Environment variable contains invalid characters, sanitizing')
      return value.replace(/[^\w\-.,/:=@]/g, '')
    }

    return value.trim()
  }

  /**
   * 清理路径，防止路径遍历攻击
   * @param {string} p - 路径
   * @returns {string|null} 清理后的路径，如果不安全则返回null
   */
  sanitizePath(p) {
    if (!this._isInputSafe(p)) {
      log.warn('Unsafe path detected:', p.substring(0, 100))
      return null
    }

    try {
      const normalized = this.path.normalize(p)
      const resolved = this.path.resolve(normalized)

      // 检查是否包含路径遍历
      if (normalized.includes('..') && !resolved.startsWith(this.process.cwd())) {
        log.warn('Path traversal attempt detected:', p)
        return null
      }

      return resolved
    }
    catch (error) {
      log.error('Error sanitizing path:', error.message)
      return null
    }
  }

  /**
   * 获取缓存的检测结果（同步版本）
   * @param {string} key - 缓存键名
   * @param {Function} fn - 计算函数
   * @returns {any} 检测结果
   */
  _getCachedResult(key, fn) {
    const cached = this._detectionCache.get(key)
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
      return cached.value
    }

    try {
      const value = fn()
      this._detectionCache.set(key, {
        value,
        timestamp: Date.now(),
      })
      return value
    }
    catch (error) {
      log.error(`Error in cached operation ${key}:`, error.message)
      // 如果有旧缓存，返回旧值
      if (cached) {
        log.debug(`Using stale cache for ${key}`)
        return cached.value
      }
      throw error
    }
  }

  /**
   * 获取缓存的异步检测结果
   * @param {string} key - 缓存键名
   * @param {Function} fn - 异步计算函数
   * @returns {Promise<any>} 检测结果
   */
  async _getCachedAsyncResult(key, fn) {
    const cached = this._asyncCache.get(key)
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
      return cached.value
    }

    try {
      const value = await fn()
      this._asyncCache.set(key, {
        value,
        timestamp: Date.now(),
      })
      return value
    }
    catch (error) {
      log.error(`Error in async cached operation ${key}:`, error.message)
      // 如果有旧缓存，返回旧值
      if (cached) {
        log.debug(`Using stale async cache for ${key}`)
        return cached.value
      }
      throw error
    }
  }

  /**
   * 清除检测缓存（主要用于测试）
   */
  clearCache() {
    this._detectionCache.clear()
    this._asyncCache.clear()
  }

  /**
   * 验证输入字符串的安全性
   * @param {string} input - 输入字符串
   * @param {number} maxLength - 最大长度
   * @returns {boolean} 是否安全
   */
  _isInputSafe(input, maxLength = this.config.maxPathLength) {
    if (typeof input !== 'string')
      return false
    if (input.length > maxLength)
      return false
    if (input.includes('\0'))
      return false // 空字节检查
    return true
  }
}

const sandboxManager = new SandboxManager()

export default sandboxManager

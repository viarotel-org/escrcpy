import { app } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import log from './log.js'

/**
 * 沙盒自动配置管理器
 * 自动检测 Linux 环境并在必要时禁用 Chromium 沙盒
 */
class SandboxManager {
  /**
   * 自动检测环境并配置沙盒
   */
  configureSandbox() {
    // 只在 Linux 平台执行检测
    if (process.platform !== 'linux') {
      return
    }

    let shouldDisable = false
    let reason = ''

    // 检查是否以 root 用户运行
    if (this.isRunningAsRoot()) {
      shouldDisable = true
      reason = 'Running as root user'
    }
    // 检查 Wayland 环境
    else if (this.isWaylandSession()) {
      shouldDisable = true
      reason = 'Running in Wayland session'
    }
    // 检查容器环境
    else if (this.isRunningInContainer()) {
      shouldDisable = true
      reason = 'Running in container environment'
    }
    // 检查特殊打包环境
    else if (this.isProblematicEnvironment()) {
      shouldDisable = true
      reason = 'Running in special packaging environment'
    }
    // 检查 chrome-sandbox 权限
    else if (!this.checkChromeSandboxPermissions()) {
      shouldDisable = true
      reason = 'Chrome sandbox permissions issue'
    }

    if (shouldDisable) {
      app.commandLine.appendSwitch('no-sandbox')
      app.commandLine.appendSwitch('disable-dev-shm-usage')
      log.warn(`Disabling Chromium sandbox: ${reason}`)
    }
  }

  isRunningAsRoot() {
    try {
      return process.getuid && process.getuid() === 0
    }
    catch (error) {
      return false
    }
  }

  isWaylandSession() {
    return (
      process.env.XDG_SESSION_TYPE === 'wayland'
      || process.env.WAYLAND_DISPLAY
      || process.env.GDK_BACKEND === 'wayland'
    )
  }

  isRunningInContainer() {
    try {
      return (
        fs.existsSync('/.dockerenv')
        || process.env.container
        || process.env.DOCKER_CONTAINER
        || process.env.KUBERNETES_SERVICE_HOST
        || (fs.existsSync('/proc/1/cgroup')
          && fs.readFileSync('/proc/1/cgroup', 'utf8').includes('docker'))
      )
    }
    catch (error) {
      return false
    }
  }

  isProblematicEnvironment() {
    return !!(process.env.SNAP || process.env.FLATPAK_ID || process.env.APPIMAGE)
  }

  checkChromeSandboxPermissions() {
    const possiblePaths = [
      path.join(process.resourcesPath, 'chrome-sandbox'),
      path.join(app.getAppPath(), 'chrome-sandbox'),
      path.join(process.execPath, '..', 'chrome-sandbox'),
      '/opt/Escrcpy/chrome-sandbox',
    ]

    for (const sandboxPath of possiblePaths) {
      if (!fs.existsSync(sandboxPath)) continue
      
      try {
        const stats = fs.statSync(sandboxPath)
        if (!stats.isFile()) continue
        
        const mode = stats.mode & Number.parseInt('777', 8)
        const isSetuid = (stats.mode & Number.parseInt('4000', 8)) !== 0
        
        // 检查权限是否正确
        if (isSetuid && mode === Number.parseInt('755', 8) && (this.isRunningAsRoot() || stats.uid === 0)) {
          return true
        }
      } catch (error) {
        continue
      }
    }
    
    return false
  }
}

// 创建单例实例
const sandboxManager = new SandboxManager()

export default sandboxManager

import { spawnShell } from '$electron/helpers/process/shell.js'
import { getAdbPath } from '$electron/configs/index.js'

/**
 * Shell instance manager
 */
class ShellManager {
  constructor() {
    this.shells = new Map()
  }

  /**
   * Create an ADB Shell instance
   * @param {string} deviceId - Device ID
   * @param {object} options - Options
   * @returns {Promise<{id: string, controller: object}>}
   */
  async createAdbShell(deviceId, options = {}) {
    const shellId = `shell-${deviceId}-${Date.now()}`
    const adbPath = getAdbPath()

    const controller = await spawnShell(
      [adbPath, '-s', deviceId, 'shell', '-tt'],
      {
        ...options,
        shell: false, // Do not use system shell packaging, directly execute adb
        encoding: 'utf8', // ADB shell defaults to UTF-8
      },
    )

    this.shells.set(shellId, {
      deviceId,
      controller,
      createdAt: Date.now(),
    })

    // Listen for process exit and automatically clean up
    controller.raw.on('exit', () => {
      this.destroy(shellId)
    })

    return {
      id: shellId,
      controller,
    }
  }

  /**
   * Get Shell instance
   * @param {string} shellId - Shell ID
   * @returns {object|null}
   */
  get(shellId) {
    return this.shells.get(shellId) || null
  }

  /**
   * Destroy Shell instance
   * @param {string} shellId - Shell ID
   */
  destroy(shellId) {
    const shell = this.shells.get(shellId)
    if (!shell) {
      return
    }

    try {
      if (!shell.controller.isEnded) {
        shell.controller.stop()
      }
    }
    catch (error) {
      console.warn(`[Terminal] Failed to stop shell ${shellId}:`, error.message)
    }

    this.shells.delete(shellId)
  }

  /**
   *  Destroy Shell instances by device ID
   * @param {string} deviceId - 设备 ID
   */
  destroyByDevice(deviceId) {
    const shellIds = []
    for (const [shellId, shell] of this.shells) {
      if (shell.deviceId === deviceId) {
        shellIds.push(shellId)
      }
    }
    shellIds.forEach(id => this.destroy(id))
  }

  /**
   * Destroy all Shell instances
   */
  destroyAll() {
    const shellIds = Array.from(this.shells.keys())
    shellIds.forEach(id => this.destroy(id))
  }

  /**
   * Get the number of managed Shell instances
   */
  get size() {
    return this.shells.size
  }
}

export const shellManager = new ShellManager()

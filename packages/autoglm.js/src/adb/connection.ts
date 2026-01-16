import type { DeviceInfo } from './types'
import { exec } from 'tinyexec'
import { CONNECTION_TYPE } from './constants'
import { ADBAutoInstaller } from './installer'

export class ADBConnection {
  adb: string

  constructor() {
    const autoInstaller = new ADBAutoInstaller()
    this.adb = autoInstaller.adb
  }

  /**
   * Get ADB version.
   */
  async version() {
    try {
      const result = await exec(this.adb, ['version'])
      const versionLine = result.stdout.trim().split('\n')[0]
      const versionMatch = versionLine.match(/(\d+\.\d+\.\d+)/)
      const version = versionMatch ? versionMatch[1] : null
      return { success: true, message: versionLine, version }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        version: null,
      }
    }
  }

  /**
   * Connect to a remote device.
   */
  async connect(address: string) {
    try {
      const result = await exec(this.adb, ['connect', address])
      const stdout = result.stdout.trim()
      if (stdout.includes('connected to') || stdout.includes('already connected')) {
        return { success: true, message: stdout }
      }
      else {
        return { success: false, message: stdout }
      }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Disconnect from a device.
   */
  async disconnect(address?: string) {
    try {
      const args = address ? ['disconnect', address] : ['disconnect']
      const result = await exec(this.adb, args)
      return { success: true, message: result.stdout.trim() }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Enable TCP/IP debugging on USB device.
   */
  async enableTCPIP(port: number = 5555, deviceId?: string) {
    try {
      const args = deviceId ? ['-s', deviceId, 'tcpip', port.toString()] : ['tcpip', port.toString()]
      const result = await exec(this.adb, args)
      return { success: true, message: result.stdout.trim() }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get device IP address.
   */
  async getDeviceIp(deviceId?: string) {
    try {
      const args = deviceId ? ['-s', deviceId, 'shell', 'ip', 'addr', 'show', 'wlan0'] : ['shell', 'ip', 'addr', 'show', 'wlan0']
      const result = await exec(this.adb, args)

      const ipMatch = result.stdout.match(/inet\s+(\d+\.\d+\.\d+\.\d+)/)
      return ipMatch ? ipMatch[1] : null
    }
    catch {
      return null
    }
  }

  /**
   * List all connected devices.
   */
  async listDevices(): Promise<DeviceInfo[]> {
    const result = await exec(this.adb, ['devices', '-l'])
    const lines = result.stdout.trim().split('\n')

    // Skip the first line (header)
    const deviceLines = lines.slice(1).filter(line => line.trim())

    const devices = await Promise.all(deviceLines.map(async (line) => {
      const parts = line.split(/\s+/)
      const deviceId = parts[0]
      const status = parts[1] as 'device' | 'unauthorized' | 'offline'

      // Determine connection type
      const connectionType = deviceId.includes(':') ? CONNECTION_TYPE.TCPIP : CONNECTION_TYPE.USB

      // Extract model info if available
      let model
      for (const part of parts) {
        if (part.startsWith('model:')) {
          model = part.replace('model:', '')
          break
        }
      }

      // Get detailed device info
      const deviceInfo: DeviceInfo = {
        deviceId,
        status,
        connectionType,
        model,
      }

      // Only get detailed info if device is online
      if (status === 'device') {
        try {
          const [brand, manufacturer, device, androidVersion, apiLevel] = await Promise.all([
            this.getDeviceProp(deviceId, 'ro.product.brand'),
            this.getDeviceProp(deviceId, 'ro.product.manufacturer'),
            this.getDeviceProp(deviceId, 'ro.product.device'),
            this.getDeviceProp(deviceId, 'ro.build.version.release'),
            this.getDeviceProp(deviceId, 'ro.build.version.sdk'),
          ])

          deviceInfo.brand = brand || undefined
          deviceInfo.manufacturer = manufacturer || undefined
          deviceInfo.device = device || undefined
          deviceInfo.androidVersion = androidVersion || undefined
          deviceInfo.apiLevel = apiLevel || undefined
        }
        catch {
        }
      }

      return deviceInfo
    }))

    return devices
  }

  /**
   * Get device property value.
   */
  private async getDeviceProp(deviceId: string, prop: string): Promise<string | null> {
    try {
      const result = await exec(this.adb, ['-s', deviceId, 'shell', 'getprop', prop])
      const value = result.stdout.trim()
      return value || null
    }
    catch {
      return null
    }
  }

  /**
   * Check device is connected.
   */
  async devices() {
    try {
      const result = await exec(this.adb, ['devices'])
      const lines = result.stdout.trim().split('\n')
      const devices = lines.slice(1).filter(line => line.trim() && line.includes('\tdevice'))
      if (devices.length === 0) {
        return { success: false, message: 'No devices connected' }
      }
      else {
        const deviceIds = devices.map(d => d.split('\t')[0])
        return { success: true, message: deviceIds.join(', ') }
      }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

import type { DeviceInfo } from './types'
import type { AgentContext } from '@/context'
import { ADBConnection } from './connection'
import { ADBAutoInstaller } from './installer'
import { ADBKeyboard } from './keyboard'

export class ADBManager {
  private ctx: AgentContext
  private connection: ADBConnection
  private keyboard: ADBKeyboard

  constructor(context: AgentContext) {
    this.ctx = context
    this.connection = new ADBConnection()
    this.keyboard = new ADBKeyboard(context)
  }

  async install(customPlatformToolsPath?: string) {
    const installer = new ADBAutoInstaller(customPlatformToolsPath)
    await installer.install()
  }

  async getVersion() {
    return this.connection.version()
  }

  async getConnectedDevices(): Promise<DeviceInfo[]> {
    return this.connection.listDevices()
  }

  async devices() {
    return this.connection.devices()
  }

  async connect(address: string) {
    return this.connection.connect(address)
  }

  async disconnect(address?: string) {
    return this.connection.disconnect(address)
  }

  async enableTCPIP(port: number = 5555, deviceId?: string) {
    return this.connection.enableTCPIP(port, deviceId)
  }

  async getDeviceIp(deviceId?: string) {
    return this.connection.getDeviceIp(deviceId)
  }

  async isKeyboardInstalled() {
    return this.keyboard.isKeyboardInstalled()
  }

  async installKeyboard(customApkPath?: string) {
    return this.keyboard.installKeyboard(customApkPath)
  }
}

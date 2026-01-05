import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import { isLinux, isMacOS, isWindows } from 'std-env'

export class ADBAutoInstaller {
  private installPath: string
  private adbPath: string
  private platformToolsPath: string

  constructor(customPlatformToolsPath?: string) {
    this.installPath = this.getDefaultInstallPath()

    this.platformToolsPath = customPlatformToolsPath ?? path.join(this.installPath, 'platform-tools')
    this.adbPath = path.join(this.platformToolsPath, 'adb')
  }

  getCurrentShellPath() {
    const shell = process.env.SHELL?.includes('zsh') || isMacOS ? 'zsh' : 'bash'
    const configFile = { bash: '.bashrc', zsh: '.zshrc' }[shell] || '.profile'
    return path.join(os.homedir(), configFile)
  }

  getDefaultInstallPath() {
    if (isWindows) {
      return path.join(process.env.ProgramFiles || os.homedir(), 'adb')
    }
    else {
      return path.join(os.homedir(), '.adb')
    }
  }

  async install() {
    await fs.ensureDir(this.installPath)
    // check if adb file exists
    if (await this.check()) {
      this.setupEnvironmentVariables()
      return
    }
    // if (isMacOS) {
    //   const { installADB } = await import('@autoglm.js/platform-tools-darwin')
    //   await installADB(this.installPath)
    // }
    // if (isLinux) {
    //   const { installADB } = await import('@autoglm.js/platform-tools-linux')
    //   await installADB(this.installPath)
    // }
    // if (isWindows) {
    //   const { installADB } = await import('@autoglm.js/platform-tools-windows')
    //   await installADB(this.installPath)
    // }
    this.setupEnvironmentVariables()
  }

  setupEnvironmentVariables() {
    if (!process.env.PATH?.includes(this.platformToolsPath)) {
      process.env.PATH = `${process.env.PATH};${this.platformToolsPath}`
    }
  }

  async check() {
    return await fs.pathExists(this.adbPath)
  }
}

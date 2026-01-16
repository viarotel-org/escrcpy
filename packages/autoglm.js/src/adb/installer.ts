import { execSync } from 'node:child_process'
import path from 'node:path'
import fs from 'fs-extra'
// import { isLinux, isMacOS, isWindows } from 'std-env'
import { AUTOGLM_FILEPATH } from '@/constants'

export class ADBAutoInstaller {
  private installPath: string
  public adbPath: string
  private platformToolsPath: string
  private globalADBChecked: boolean | null = null

  constructor(customPlatformToolsPath?: string) {
    this.installPath = AUTOGLM_FILEPATH

    this.platformToolsPath = customPlatformToolsPath ?? path.join(this.installPath, 'platform-tools')
    this.adbPath = path.join(this.platformToolsPath, 'adb')
  }

  async install() {
    // check if adb file exists
    // if (await this.check()) {
    //   return
    // }

    // await fs.ensureDir(this.installPath)

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
  }

  async check() {
    return await fs.pathExists(this.adbPath)
  }

  checkGlobalADB() {
    if (this.globalADBChecked !== null) {
      return this.globalADBChecked
    }
    try {
      execSync('adb version', { stdio: 'ignore' })
      this.globalADBChecked = true
      return true
    }
    catch {
      this.globalADBChecked = false
      return false
    }
  }

  get adb() {
    const isGlobal = this.checkGlobalADB()
    return isGlobal ? 'adb' : this.adbPath
  }
}

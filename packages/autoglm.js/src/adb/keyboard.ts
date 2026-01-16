import type { AgentContext } from '@/context'
import { getErrorMessage } from '@/utils/errorMessage'
import { runAdbCommand } from './utils'

export class ADBKeyboard {
  private ctx: AgentContext
  constructor(context: AgentContext) {
    this.ctx = context
  }

  get deviceId() {
    return this.ctx.getConfig().deviceId
  }

  /**
   * Check ADB Keyboard is installed.
   */
  async isKeyboardInstalled() {
    try {
      // 首先检查已启用的输入法
      const enabledResult = await runAdbCommand(this.deviceId, ['shell', 'ime', 'list', '-s'])
      const enabledImeList = enabledResult.stdout.trim()

      if (enabledImeList.includes('com.android.adbkeyboard/.AdbIME')) {
        return { success: true, message: 'ADB Keyboard is installed and enabled' }
      }
      else {
        return { success: false, message: 'ADB Keyboard is not installed' }
      }
    }
    catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      }
    }
  }

  /**
   * Install ADB Keyboard.
   */
  async installKeyboard(customApkPath?: string) {
    try {
      const { installKeyboard } = await import('@autoglm.js/adb-keyboard')
      await installKeyboard(this.deviceId, customApkPath)
      return { success: true, message: 'ADB Keyboard installed and enabled' }
    }
    catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      }
    }
  }
}

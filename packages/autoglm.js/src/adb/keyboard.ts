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
  async isKeyboardInstalled(deviceId?: string) {
    try {
      const checkResult = await runAdbCommand(deviceId ?? this.deviceId, ['shell', 'pm', 'list', 'packages', 'com.android.adbkeyboard'])

      if (checkResult.stdout.includes('com.android.adbkeyboard')) {
        return { success: true, message: 'ADB Keyboard is installed' }
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
   * Check ADB Keyboard is enabled.
   */
  async isKeyboardEnabled(deviceId?: string) {
    try {
      const enabledResult = await runAdbCommand(deviceId ?? this.deviceId, ['shell', 'ime', 'list', '-s'])
      const enabledImeList = enabledResult.stdout.trim()

      if (enabledImeList.includes('com.android.adbkeyboard/.AdbIME')) {
        return { success: true, message: 'ADB Keyboard is enabled' }
      }
      else {
        return { success: false, message: 'ADB Keyboard is not enabled' }
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

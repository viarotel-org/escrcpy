import type { AgentContext } from '@/context'
import OpenAI from 'openai'
import { ADBConnection } from '@/adb/connection'
import { ADBKeyboard } from '@/adb/keyboard'
import { ErrorCode } from '@/constants'
import { getErrorMessage } from '@/utils/errorMessage'

export async function checkSystemRequirements(ctx: AgentContext) {
  /**
   * check adb connection
   */
  const conn = new ADBConnection()
  const key = new ADBKeyboard(ctx)

  try {
    const result = await conn.version()
    // check 1: adb installed
    if (!result.success) {
      return {
        success: false,
        code: ErrorCode.ADB_NOT_INSTALLED,
      }
    }

    // check 2: device connected
    const devices = await conn.devices()
    if (!devices.success) {
      return {
        success: false,
        code: ErrorCode.ADB_DEVICE_UNCONNECTED,
      }
    }

    // check 3: ADB Keyboard connected
    const keyboard = await key.isKeyboardInstalled()
    if (!keyboard.success) {
      return {
        success: false,
        code: ErrorCode.ADB_KEYBOARD_UNINSTALLED,
      }
    }

    return { success: true }
  }
  catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
      code: ErrorCode.UNKNOWN_ERROR,
    }
  }
}

export async function checkModelApi(ctx: AgentContext) {
  const config = ctx.getConfig()
  try {
    const client = new OpenAI({
      baseURL: config.baseUrl,
      apiKey: config.apiKey,
    })

    const response = await client.chat.completions.create({
      model: config.model,
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 5,
      temperature: 0.0,
      stream: false,
    })

    const isSuccess = response.choices && response.choices.length > 0

    if (!isSuccess) {
      return {
        success: false,
        code: ErrorCode.MODEL_API_CHECK_FAILED,
      }
    }

    return { success: true }
  }
  catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
      code: ErrorCode.UNKNOWN_ERROR,
    }
  }
}

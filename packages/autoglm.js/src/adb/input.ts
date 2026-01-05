import { Buffer } from 'node:buffer'
import { exec } from 'tinyexec'
import { runAdbCommand } from './utils'

/**
 * Get the current input method (IME) on the device.
 * @param deviceId - Optional device ID for multi-device setups
 * @returns The current IME identifier (e.g., "com.google.android.inputmethod.latin/.LatinIME")
 */
async function getCurrentIme(deviceId?: string): Promise<string> {
  try {
    const result = await runAdbCommand(
      deviceId,
      'shell',
      'settings',
      'get',
      'secure',
      'default_input_method',
    )
    // Combine stdout and stderr, then trim
    const ime = (result.stdout + result.stderr).trim()
    return ime
  }
  catch (error) {
    console.warn(`Failed to get current IME: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return ''
  }
}

/**
 * Set the input method (IME) on the device.
 * @param ime - The IME identifier to set
 * @param deviceId - Optional device ID for multi-device setups
 */
async function setIme(ime: string, deviceId?: string): Promise<void> {
  if (!ime) {
    console.warn('setIme called with empty IME identifier, skipping')
    return
  }

  try {
    await runAdbCommand(deviceId, 'shell', 'ime', 'set', ime)
  }
  catch (error) {
    console.warn(`Failed to set IME to "${ime}": ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Detect if ADB Keyboard is available and set it as the default keyboard.
 * @returns The original IME identifier for later restoration
 */

export async function detectAndSetAdbKeyboard(deviceId?: string): Promise<string> {
  // Get current IME before making any changes
  const currentIme = await getCurrentIme(deviceId)

  try {
    // Check if ADB Keyboard is installed
    const checkArgs = deviceId
      ? ['-s', deviceId, 'shell', 'pm', 'list', 'packages', 'com.android.adbkeyboard']
      : ['shell', 'pm', 'list', 'packages', 'com.android.adbkeyboard']
    const checkResult = await exec('adb', checkArgs)

    if (!checkResult.stdout.includes('com.android.adbkeyboard')) {
      console.warn('ADB Keyboard is not installed')
      return currentIme
    }

    // Only switch if not already using ADB Keyboard
    if (!currentIme.includes('com.android.adbkeyboard/.AdbIME')) {
      await setIme('com.android.adbkeyboard/.AdbIME', deviceId)
      // Wait for keyboard switch to take effect
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Warm up the keyboard by typing an empty string
      const encodedText = Buffer.from('', 'utf8').toString('base64')
      await runAdbCommand(deviceId, 'shell', 'am', 'broadcast', '-a', 'ADB_INPUT_B64', '--es', 'msg', encodedText)
    }

    return currentIme
  }
  catch (error) {
    console.warn(`Failed to set ADB Keyboard: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return currentIme
  }
}

/**
 * Restore the previous keyboard.
 * @param ime - The IME identifier to restore
 * @param deviceId - Optional device ID for multi-device setups
 */
export async function restoreKeyboard(ime: string, deviceId?: string): Promise<void> {
  // Validate IME is not empty
  if (!ime) {
    console.warn('restoreKeyboard called with empty IME identifier, skipping')
    return
  }

  // Don't restore if it's already the ADB Keyboard (no need to restore)
  if (ime.includes('com.android.adbkeyboard/.AdbIME')) {
    return
  }

  try {
    await setIme(ime, deviceId)
    // Wait for keyboard restore to take effect
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  catch (error) {
    // Silent failure - just log warning
    console.warn(`Failed to restore keyboard: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Type text using ADB Keyboard.
 * Automatically saves and restores the original keyboard.
 */
export async function typeText(text: string, deviceId?: string): Promise<void> {
  // Save original keyboard and switch to ADB Keyboard
  const originalIme = await detectAndSetAdbKeyboard(deviceId)

  try {
    // Encode and type the text
    const encodedText = Buffer.from(text, 'utf8').toString('base64')
    await runAdbCommand(deviceId, 'shell', 'am', 'broadcast', '-a', 'ADB_INPUT_B64', '--es', 'msg', encodedText)
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  finally {
    // Always restore the original keyboard, even if typing failed
    await restoreKeyboard(originalIme, deviceId)
  }
}

/**
 * Clear text by sending backspace keystrokes.
 */
export async function clearText(count: number = 100, deviceId?: string): Promise<void> {
  // Send backspace key multiple times
  for (let i = 0; i < count; i++) {
    await runAdbCommand(deviceId, 'shell', 'input', 'keyevent', '67')
  }
  await new Promise(resolve => setTimeout(resolve, 500))
}

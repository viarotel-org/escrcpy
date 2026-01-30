import ipRegex from 'ip-regex'
import { Adb } from '@devicefarmer/adbkit'

/**
 * Determine whether it is an ipv6 address
 */
export function isIpv6(string) {
  return ipRegex.v6().test(string)
}

/**
 * Get accurate file size using stat command
 * @param {object} device - ADB device object
 * @param {string} filePath - Remote file path
 * @param {object} options - Options
 * @param {boolean} options.asBigInt - Return as BigInt instead of Number (default: false)
 * @returns {Promise<number|bigint>} File size in bytes
 */
export async function getFileSize(device, filePath, options = {}) {
  const { asBigInt = false } = options

  try {
    const output = await device.shell(`stat -c %s "${filePath}"`)
    const buffer = await Adb.util.readAll(output)
    const sizeStr = buffer.toString().trim()

    return asBigInt ? BigInt(sizeStr) : (Number(sizeStr) || 0)
  }
  catch (error) {
    console.warn(`Failed to get file size for ${filePath}:`, error.message)
    return asBigInt ? 0n : 0
  }
}

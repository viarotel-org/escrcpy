import ipRegex from 'ip-regex'
import { Adb } from '@devicefarmer/adbkit'
import { parseDeviceId } from '$/utils/device/index.js'

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

export function normalizeDeviceHost(host = '') {
  return String(host).trim().replace(/^\[(.*)\]$/, '$1').toLowerCase()
}

export function createDeviceAddressKey(host, port = 5555) {
  const value = normalizeDeviceHost(host)

  if (!value) {
    return ''
  }

  return `${value}:${Number(port) || 5555}`
}

export async function getConnectedDeviceAddressKeys({ client } = {}) {
  try {
    const devices = await client.listDevicesWithPaths()

    return new Set(
      devices
        .filter(item => !['offline'].includes(item.type))
        .map((item) => {
          const { host, port } = parseDeviceId(item.id)

          return createDeviceAddressKey(host, port)
        })
        .filter(Boolean),
    )
  }
  catch (error) {
    console.warn('adb.getConnectedDeviceAddressKeys.error', error?.message || error)
    return new Set()
  }
}

export async function filterConnectedDevices(devices, { client, excludeConnected } = {}) {
  if (!excludeConnected) {
    return devices
  }

  const connectedDeviceKeys = await getConnectedDeviceAddressKeys({ client })

  if (!connectedDeviceKeys.size) {
    return devices
  }

  return devices.filter((device) => {
    const deviceKey = createDeviceAddressKey(device.address, device.port)

    return !connectedDeviceKeys.has(deviceKey)
  })
}

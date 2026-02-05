import { allSettledWrapper, sleep } from '$/utils'

export * from './migrator/index.js'
export * from './qr/index.js'
export * from './selection/index.js'

/**
 * Parse `host` and `port` from a device ID string.
 *
 * Supported formats:
 * - IPv6: "[fd7a:115c:a1e0::9c01:264d]:5555" → { host: "[fd7a:115c:a1e0::9c01:264d]", port: 5555 }
 * - IPv4: "127.0.0.1:5555" → { host: "127.0.0.1", port: 5555 }
 * - domain: "www.domain.com:1234" → { host: "www.domain.com", port: 1234 }
 *
 * When port is omitted, { port: 5555 } is returned by default.
 *
 * @param {string} string - Device ID string
 * @returns {{ host: string, port: number }} Parsed result
 */
export function parseDeviceId(string = '') {
  if (!string?.trim()) {
    return { host: '', port: 5555 }
  }

  const input = string.trim()
  const DEFAULT_PORT = 5555

  // Validate that port number is valid
  const isValidPort = port => port > 0 && port <= 65535

  // IPv6 format: [host]:port or [host]
  const ipv6Match = input.match(/^\[([^\]]+)\](?::(\d+))?$/)
  if (ipv6Match) {
    const [, host, portStr] = ipv6Match
    const port = portStr ? Number.parseInt(portStr, 10) : DEFAULT_PORT
    return { host: `[${host}]`, port: isValidPort(port) ? port : DEFAULT_PORT }
  }

  // IPv4/domain format: host:port or host
  const match = input.match(/^(.+?)(?::(\d+))?$/)
  if (match) {
    const [, host, portStr] = match
    const port = portStr ? Number.parseInt(portStr, 10) : DEFAULT_PORT
    return { host, port: isValidPort(port) ? port : DEFAULT_PORT }
  }

  // Fallback case
  return { host: input, port: DEFAULT_PORT }
}

/**
 * Select files and push them to a device
 */
export async function selectAndSendFileToDevice(
  deviceId,
  {
    files,
    multiSelections = false,
    silent = false,
    extensions = ['*'],
    selectText = window.t('device.control.file.push.placeholder'),
    loadingText = window.t('device.control.file.push.loading'),
    successText = window.t('device.control.file.push.success.name'),
  } = {},
) {
  if (!files) {
    try {
      const properties = ['openFile']

      if (multiSelections) {
        properties.push('multiSelections')
      }

      files = await window.$preload.ipcRenderer.invoke('show-open-dialog', {
        properties,
        filters: [
          {
            name: selectText,
            extensions,
          },
        ],
      })
    }
    catch (error) {
      throw new Error(error.message?.match(/Error: (.*)/)?.[1] || error.message)
    }
  }

  let closeLoading
  if (!silent) {
    closeLoading = ElMessage.loading(`${deviceId}: ${loadingText}`).close
  }

  const successFiles = []
  const failFiles = []

  await allSettledWrapper(files, async (item) => {
    const ret = await window.$preload.adb.push(deviceId, item).catch((e) => {
      console.warn(e?.message)
      failFiles.push(`${deviceId}-${item}`)
    })

    if (ret) {
      successFiles.push(ret)
    }
  })

  await sleep()

  if (failFiles.length) {
    closeLoading?.()
    throw new Error(`Push file failed: ${failFiles.join(',')}`)
  }

  closeLoading?.()

  if (!silent) {
    ElMessage.success({ message: successText, grouping: true })
  }

  return successFiles
}

export function openFloatControl(device) {
  const floatControl = window.$preload.store.get('common.floatControl')

  if (!floatControl) {
    return false
  }

  window.$preload.win.open('pages/control', { device })
  return true
}

export function removeDevices(...devices) {
  const storeDevices = { ...(window.$preload.store.get('device') || {}) }

  for (const device of devices) {
    delete storeDevices[device.id ?? device]
  }

  window.$preload.store.set('device', storeDevices)
}

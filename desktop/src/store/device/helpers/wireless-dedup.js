import { defaultsDeep } from 'lodash-es'

function getWirelessSerial(device) {
  if (!device.wifi || ['unauthorized', 'authorizing'].includes(device.status)) {
    return null
  }

  const serial = typeof device.serialNo === 'string' ? device.serialNo.trim() : ''
  // getSerialNo falls back to the transport ID when ADB cannot read ro.serialno.
  if (!serial || serial === device.id || ['unknown', 'null', 'undefined'].includes(serial.toLowerCase())) {
    return null
  }

  return serial
}

/**
 * Collapse stale wireless transports by hardware serial, retaining live transports.
 * The caller migrates settings before persisting the reduced device list.
 */
export function deduplicateWirelessDevices(devices, currentDevices) {
  const currentIds = new Set(currentDevices.map(device => device.id))
  const groups = new Map()

  for (const device of devices) {
    const serial = getWirelessSerial(device)
    if (!serial) {
      continue
    }
    if (!groups.has(serial)) {
      groups.set(serial, [])
    }
    groups.get(serial).push(device)
  }

  const removedIds = new Set()
  const replacements = new Map()
  const migrations = []

  for (const group of groups.values()) {
    // Current devices come first in mergeDevices; offline-only groups retain that order.
    const target = group.find(device => currentIds.has(device.id)) || group[0]
    const stale = group.filter(device => device.id !== target.id && !currentIds.has(device.id))
    if (!stale.length) {
      continue
    }

    // Preserve the chosen record's explicit values, filling missing remarks/metadata.
    replacements.set(target.id, defaultsDeep({}, target, ...stale))
    for (const device of stale) {
      removedIds.add(device.id)
      migrations.push({ oldDeviceId: device.id, newDeviceId: target.id })
    }
  }

  return {
    devices: devices.filter(device => !removedIds.has(device.id)).map(device => replacements.get(device.id) || device),
    migrations,
  }
}

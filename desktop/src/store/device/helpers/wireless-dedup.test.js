import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a test framework.
import { test } from 'node:test'
import { ScrcpyConfigMigrator } from '../../../utils/device/migrator/index.js'
import { deduplicateWirelessDevices } from './wireless-dedup.js'

function wireless(id, options = {}) {
  return { id, serialNo: 'SERIAL-A', wifi: true, status: 'offline', ...options }
}

test('a live wireless address replaces old ports and inherits missing metadata', () => {
  const old = wireless('192.168.1.2:30000', { remark: 'My phone', screenWidth: 1080 })
  const current = wireless('192.168.1.2:40000', { status: 'device' })
  const original = structuredClone([old, current])
  const result = deduplicateWirelessDevices([old, current], [current])

  assert.deepEqual(result.devices, [{ ...current, remark: 'My phone', screenWidth: 1080 }])
  assert.deepEqual(result.migrations, [{ oldDeviceId: old.id, newDeviceId: current.id }])
  assert.deepEqual([old, current], original)
})

test('matching serials merge across IP changes but different serials never merge by IP', () => {
  const old = wireless('192.168.1.2:30000')
  const current = wireless('192.168.1.3:40000', { status: 'device' })
  const other = wireless('192.168.1.2:50000', { serialNo: 'SERIAL-B', status: 'device' })
  const result = deduplicateWirelessDevices([current, other, old], [current, other])
  assert.deepEqual(result.devices, [current, other])
  assert.deepEqual(result.migrations, [{ oldDeviceId: old.id, newDeviceId: current.id }])
})

test('USB and unknown serials remain independent', () => {
  const devices = [
    wireless('SERIAL-A', { wifi: false }),
    wireless('192.168.1.2:30000'),
    wireless('192.168.1.2:40000', { serialNo: '' }),
    wireless('192.168.1.2:40001', { serialNo: undefined }),
    wireless('192.168.1.2:40002', { serialNo: 'unknown' }),
    wireless('192.168.1.2:40003', { serialNo: 'unknown' }),
    wireless('192.168.1.2:40004', { serialNo: '192.168.1.2:40004' }),
    wireless('adb-serial._adb-tls-connect._tcp', { serialNo: 'adb-serial._adb-tls-connect._tcp' }),
  ]
  assert.deepEqual(deduplicateWirelessDevices(devices, []), { devices, migrations: [] })
})

test('offline-only duplicates retain a stable address and explicit remarks', () => {
  const preferred = wireless('192.168.1.2:40000', { remark: '' })
  const old = wireless('192.168.1.2:30000', { remark: 'Old remark' })
  const result = deduplicateWirelessDevices([preferred, old], [])
  assert.deepEqual(result.devices, [preferred])
  assert.equal(result.migrations.length, 1)
  assert.deepEqual(deduplicateWirelessDevices(result.devices, []), { devices: [preferred], migrations: [] })
})

test('simultaneously present transports survive while their stale history is collapsed', () => {
  const first = wireless('192.168.1.2:40000', { status: 'device' })
  const second = wireless('adb-serial._adb-tls-connect._tcp', { status: 'device' })
  const stale = wireless('192.168.1.2:30000')
  const result = deduplicateWirelessDevices([first, second, stale], [first, second])
  assert.deepEqual(result.devices, [first, second])
  assert.deepEqual(result.migrations, [{ oldDeviceId: stale.id, newDeviceId: first.id }])
})

test('unauthorized devices are not used to discard known historical records', () => {
  const known = wireless('192.168.1.2:30000')
  const unauthorized = wireless('192.168.1.2:40000', { status: 'unauthorized' })
  const result = deduplicateWirelessDevices([unauthorized, known], [unauthorized])
  assert.deepEqual(result, { devices: [unauthorized, known], migrations: [] })
})

test('serial matching is exact rather than a substring match', () => {
  const devices = [wireless('host:1'), wireless('host:2', { serialNo: 'SERIAL-AB' })]
  assert.deepEqual(deduplicateWirelessDevices(devices, []), { devices, migrations: [] })
})

test('configuration migration preserves target settings and cleans only merged histories', (t) => {
  const current = wireless('192.168.1.2:40000', { status: 'device' })
  const old = wireless('192.168.1.2:30000')
  let config = {
    'global': { audio: true },
    'SERIAL-A': { maxSize: 720 },
    [old.id]: { audio: true, maxSize: 1080, window: { x: 10, y: 20 } },
    [current.id]: { audio: false, window: { x: 0 } },
  }
  const previousWindow = globalThis.window
  globalThis.window = {
    $preload: {
      store: {
        get: () => structuredClone(config),
        set: (key, value) => {
          assert.equal(key, 'scrcpy')
          config = structuredClone(value)
        },
      },
    },
  }
  t.after(() => {
    if (previousWindow === undefined) {
      delete globalThis.window
    }
    else {
      globalThis.window = previousWindow
    }
  })

  const { migrations } = deduplicateWirelessDevices([current, old], [current])
  const migrator = new ScrcpyConfigMigrator()
  for (const { oldDeviceId, newDeviceId } of migrations) {
    migrator.migrateConfigFromOldToNew(oldDeviceId, newDeviceId)
  }
  // Old settings remain until the caller has persisted the reduced device list.
  assert.ok(config[old.id])
  migrator.cleanupProcessedConfigs()
  assert.deepEqual(config, {
    'global': { audio: true },
    'SERIAL-A': { maxSize: 720 },
    [current.id]: { audio: false, maxSize: 1080, window: { x: 0, y: 20 } },
  })
})

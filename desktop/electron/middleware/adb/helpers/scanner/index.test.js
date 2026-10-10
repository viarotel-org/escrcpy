// Run: node --experimental-vm-modules --test desktop/electron/middleware/adb/helpers/scanner/index.test.js
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { readFile } from 'node:fs/promises'
import net from 'node:net'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner; this repo has no Vitest dependency.
import { beforeEach, mock, test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { SourceTextModule, SyntheticModule } from 'node:vm'
import treeKill from '@magda/tree-kill'

// Keep Electron aliases and multicast sockets out of these protocol/lifecycle tests.
async function loadModule(url, imports) {
  const module = new SourceTextModule(await readFile(url, 'utf8'))
  await module.link((specifier) => {
    const exports = imports[specifier]
    assert.ok(exports, `Unexpected import: ${specifier}`)
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) {
        this.setExport(key, value)
      }
    })
  })
  await module.evaluate()
  return module.namespace
}

class Bonjour {
  static instances = []
  browsers = []
  destroy = mock.fn()

  constructor() {
    Bonjour.instances.push(this)
  }

  find({ type }, callback) {
    const browser = { type, callback, stop: mock.fn() }
    this.browsers.push(browser)
    return browser
  }

  static emit(type, address = '192.168.1.2', port = 37123) {
    for (const instance of Bonjour.instances) {
      for (const browser of instance.browsers.filter(browser => browser.type === type)) {
        browser.callback({ name: 'bonjour-device', type, addresses: [address], port })
      }
    }
  }
}

const { AdbScanner, DeviceScanner, MDNS_CONFIG, parseAdbMdnsServices, scanMdnsDevices } = await loadModule(new URL('./index.js', import.meta.url), {
  'bonjour-service': { Bonjour },
  'node:net': { default: net },
  '$electron/helpers/store/index.js': { default: { get: () => ({}) } },
  '$/utils/device/index.js': { parseDeviceId: () => ({ port: 5555 }) },
  'p-limit': { default: () => fn => fn() },
})

const header = 'List of discovered mdns services\r\n'
const connectService = 'adb-example\t_adb-tls-connect._tcp.\t192.168.1.2:37123\r\n'

beforeEach(() => {
  Bonjour.instances = []
})

test('parses connect, pairing and legacy services and ignores non-IPv4 entries', () => {
  const devices = parseAdbMdnsServices(`${header}${connectService}qr-name _adb-tls-pairing._tcp 192.168.1.3:41234\nlegacy _adb._tcp 192.168.1.4:5555\ninvalid _adb._tcp bad:5555\nipv6 _adb._tcp [::1]:5555\n`)
  assert.deepEqual(devices.map(({ address, port, source }) => ({ address, port, source })), [
    { address: '192.168.1.2', port: 37123, source: 'adb-tls-connect' },
    { address: '192.168.1.3', port: 41234, source: 'adb-tls-pairing' },
    { address: '192.168.1.4', port: 5555, source: 'adb' },
  ])
  assert.deepEqual(parseAdbMdnsServices(''), [])
})

test('returns native devices immediately, deduplicates endpoints and stops polling', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const onDevice = mock.fn()
  const mdnsServices = mock.fn(async () => ({ stdout: header + connectService.repeat(2) }))
  const devices = await scanMdnsDevices({ adb: { mdnsServices }, onDevice })
  assert.equal(devices.length, 1)
  assert.equal(onDevice.mock.callCount(), 1)
  assert.equal(Bonjour.instances.length, 0)
  assert.equal(mdnsServices.mock.calls[0].arguments[0].signal.aborted, true)
  t.mock.timers.tick(MDNS_CONFIG.DISCOVER_TIMEOUT)
  await setImmediate()
  assert.equal(mdnsServices.mock.callCount(), 1)
})

test('retries an empty native snapshot while Bonjour scans the wrong interface', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  let calls = 0
  const pending = scanMdnsDevices({
    adb: { mdnsServices: async () => ({ stdout: ++calls === 1 ? header : header + connectService }) },
  })
  await setImmediate()
  assert.equal(Bonjour.instances.length, 1)
  t.mock.timers.tick(MDNS_CONFIG.POLL_INTERVAL)
  const devices = await pending
  assert.equal(calls, 2)
  assert.equal(devices[0].address, '192.168.1.2')
  assert.equal(Bonjour.instances[0].destroy.mock.callCount(), 1)
})

test('unsupported native mDNS falls back to Bonjour', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const pending = scanMdnsDevices({
    adb: { mdnsServices: async () => { throw new Error('unknown command') } },
  })
  await setImmediate()
  Bonjour.emit(MDNS_CONFIG.CONNECT_TYPE)
  t.mock.timers.tick(MDNS_CONFIG.DISCOVER_TIMEOUT)
  const devices = await pending
  assert.equal(devices.length, 1)
  assert.equal(devices[0].name, 'bonjour-device')
})

test('overall discovery timeout cancels a hung native query and ignores late results', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  let complete
  let signal
  const onDevice = mock.fn()
  const pending = scanMdnsDevices({
    timeout: 100,
    onDevice,
    adb: {
      mdnsServices: (options) => {
        signal = options.signal
        return new Promise((resolve) => {
          complete = resolve
        })
      },
    },
  })
  t.mock.timers.tick(100)
  assert.deepEqual(await pending, [])
  assert.equal(signal.aborted, true)
  complete({ stdout: header + connectService })
  await setImmediate()
  assert.equal(onDevice.mock.callCount(), 0)
  assert.equal(Bonjour.instances.length, 0)
})

test('slow native queries never overlap and disposal prevents further polling', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  let complete
  const mdnsServices = mock.fn(() => new Promise((resolve) => {
    complete = resolve
  }))
  const scanner = new DeviceScanner({ mdnsServices })
  await scanner.startScanning(MDNS_CONFIG.CONNECT_TYPE, () => {})
  t.mock.timers.tick(MDNS_CONFIG.POLL_INTERVAL * 5)
  assert.equal(mdnsServices.mock.callCount(), 1)
  scanner.dispose()
  complete({ stdout: header })
  await setImmediate()
  t.mock.timers.tick(MDNS_CONFIG.POLL_INTERVAL * 5)
  assert.equal(mdnsServices.mock.callCount(), 1)
})

test('QR pairing and the subsequent connection use native discovery', async () => {
  const pair = mock.fn(async () => {})
  const connect = mock.fn(async () => {})
  const scanner = new AdbScanner()
  const result = await scanner.connect({
    password: '123456',
    adb: {
      pair,
      connect,
      mdnsServices: async () => ({ stdout: `${header}${connectService}qr-name _adb-tls-pairing._tcp 192.168.1.2:41234\n` }),
    },
  })
  assert.equal(result.success, true)
  assert.deepEqual(pair.mock.calls[0].arguments, ['192.168.1.2', 41234, '123456'])
  assert.deepEqual(connect.mock.calls[0].arguments, ['192.168.1.2', 37123])
  assert.equal(Bonjour.instances.length, 0)
})

test('unrelated native devices do not suppress Bonjour while waiting for a paired device', async () => {
  const scanner = new AdbScanner()
  scanner.adb = { mdnsServices: async () => ({ stdout: header + connectService }) }
  const pending = scanner.waitForDeviceConnect({ address: '192.168.1.3' })
  await setImmediate()
  Bonjour.emit(MDNS_CONFIG.CONNECT_TYPE, '192.168.1.3', 45678)
  assert.equal((await pending).port, 45678)
})

const { sheller } = await loadModule(new URL('../../../../helpers/shell/index.js', import.meta.url), {
  'node:child_process': { spawn },
  'shell-quote': { default: {} },
  '@magda/tree-kill': { default: treeKill },
  '$electron/process/helper.js': { setupEnvPath: () => {} },
})

test('native command timeout kills the process and enables Bonjour fallback', async () => {
  let child
  const scanner = new DeviceScanner({
    mdnsServices: ({ signal, timeout }) => {
      assert.equal(timeout, MDNS_CONFIG.NATIVE_TIMEOUT)
      child = sheller([process.execPath, '-e', 'setInterval(() => {}, 1000)'], {
        signal,
        timeout: 50,
        encoding: 'utf8',
      })
      return child
    },
  })
  try {
    await scanner.startScanning(MDNS_CONFIG.CONNECT_TYPE, () => {})
    await once(child, 'close')
    await setImmediate()
    assert.ok(child.exitCode !== null || child.signalCode !== null)
    assert.equal(Bonjour.instances.length, 1)
  }
  finally {
    scanner.dispose()
  }
})

test('ending discovery aborts and terminates a still-running native process', async () => {
  let closed
  let child
  const devices = await scanMdnsDevices({
    timeout: 50,
    adb: {
      mdnsServices: (options) => {
        child = sheller([process.execPath, '-e', 'setInterval(() => {}, 1000)'], {
          ...options,
          encoding: 'utf8',
        })
        // Aborting emits an error before close, so wait for close without rejecting on error.
        closed = new Promise(resolve => child.once('close', resolve))
        return child
      },
    },
  })
  assert.deepEqual(devices, [])
  await closed
  assert.ok(child.exitCode !== null || child.signalCode !== null)
  assert.equal(Bonjour.instances.length, 0)
})

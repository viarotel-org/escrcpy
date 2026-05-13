import { Bonjour } from 'bonjour-service'
import net from 'node:net'
import electronStore from '$electron/helpers/store/index.js'
import { parseDeviceId } from '$/utils/device/index.js'
import pLimit from 'p-limit'

export const MDNS_CONFIG = {
  PAIRING_TYPE: 'adb-tls-pairing',
  CONNECT_TYPE: 'adb-tls-connect',
  LEGACY_ADB_TYPE: 'adb',
  DEFAULT_TIMEOUT: 60 * 1000,
  CONNECT_TIMEOUT: 30 * 1000,
  DISCOVER_TIMEOUT: 8 * 1000,
  PROBE_TIMEOUT: 1000,
  DEFAULT_PROBE_PORTS: [5555],
}

export const ERROR_CODES = {
  TIMEOUT: 'TIMEOUT',
  PAIRING_FAILED: 'PAIRING_FAILED',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  INVALID_PARAMS: 'INVALID_PARAMS',
}

export class DeviceData {
  constructor(name, address, port, source = '') {
    this.name = name
    this.address = address
    this.port = port
    this.source = source
  }

  static fromMdnsService(service, source = '') {
    const ipv4Address = service.addresses?.find(addr => net.isIP(addr) === 4)
    if (!ipv4Address)
      return null

    return new DeviceData(
      service.name,
      ipv4Address,
      service.port,
      source || service.type,
    )
  }
}

export class MonitorError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

export class DeviceScanner {
  constructor() {
    this.bonjour = null
    this.scanner = null
    this.scanners = []
  }

  async startScanning(type, callback) {
    return this.startScanningMultiple([type], callback)
  }

  async startScanningMultiple(types, callback) {
    this.dispose()
    this.bonjour = new Bonjour()

    this.scanners = types.map(type =>
      this.bonjour.find({ type }, (service) => {
        const device = DeviceData.fromMdnsService(service, type)
        if (device) {
          callback(device)
        }
      }),
    )
    this.scanner = this.scanners[0] ?? null
  }

  dispose() {
    const scanners = [...new Set([this.scanner, ...this.scanners])].filter(Boolean)
    scanners.forEach(scanner => scanner.stop())
    this.scanner = null
    this.scanners = []

    if (this.bonjour) {
      this.bonjour.destroy()
      this.bonjour = null
    }
  }
}

function createDeviceKey(device) {
  return `${device.address}:${device.port}`
}

function normalizePorts(ports) {
  return [...new Set(ports.filter(Boolean).map(Number).filter(Boolean))]
}

export async function scanMdnsDevices(options = {}) {
  const {
    types = [MDNS_CONFIG.CONNECT_TYPE, MDNS_CONFIG.LEGACY_ADB_TYPE],
    timeout = MDNS_CONFIG.DISCOVER_TIMEOUT,
    onStatus = () => {},
    onDevice = () => {},
  } = options

  const deviceScanner = new DeviceScanner()
  const devices = new Map()

  onStatus('scanning')

  return new Promise((resolve) => {
    let timeoutHandle = null

    const finish = (status) => {
      clearTimeout(timeoutHandle)
      deviceScanner.dispose()

      if (!devices.size) {
        onStatus(status)
      }

      resolve([...devices.values()])
    }

    timeoutHandle = setTimeout(() => {
      finish('not-found')
    }, timeout)

    deviceScanner.startScanningMultiple(types, (device) => {
      const key = createDeviceKey(device)

      if (devices.has(key)) {
        return
      }

      devices.set(key, device)
      onStatus('found', device)
      onDevice(device)
    })
  })
}

export async function probePort(host, port, timeout = MDNS_CONFIG.PROBE_TIMEOUT) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port })

    const done = (reachable) => {
      socket.removeAllListeners()
      socket.destroy()
      resolve(reachable)
    }

    socket.setTimeout(timeout)
    socket.once('connect', () => done(true))
    socket.once('error', () => done(false))
    socket.once('timeout', () => done(false))
  })
}

export async function probeDeviceCandidates(devices, options = {}) {
  const {
    ports = MDNS_CONFIG.DEFAULT_PROBE_PORTS,
    timeout = MDNS_CONFIG.PROBE_TIMEOUT,
    concurrency = 20,
    onStatus = () => {},
    onDevice = () => {},
  } = options

  const candidates = new Map()

  devices.forEach((device) => {
    normalizePorts([device.port, ...ports]).forEach((port) => {
      const candidate = {
        ...device,
        port,
        source: port === device.port ? device.source : `${device.source || 'mdns'}:probe`,
      }

      candidates.set(createDeviceKey(candidate), candidate)
    })
  })

  const limit = pLimit(concurrency)
  const results = await Promise.all(
    [...candidates.values()].map(candidate =>
      limit(async () => {
        onStatus('probing', candidate)

        const reachable = await probePort(candidate.address, candidate.port, timeout)
        const result = {
          ...candidate,
          reachable,
        }

        if (reachable) {
          onDevice(result)
        }

        return result
      }),
    ),
  )

  return results.filter(item => item.reachable)
}

export class AdbScanner {
  constructor() {
    this.deviceScanner = new DeviceScanner()
    this.isActive = false
    this.adb = null
    this.onStatus = () => {}
  }

  async connect(options) {
    this.validateOptions(options)

    const {
      adb,
      password,
      onStatus = () => {},
    } = options

    this.adb = adb
    this.isActive = true
    this.onStatus = onStatus

    try {
      this.onStatus('pairing')
      const device = await this.scanForDevice()
      await this.pairWithDevice(device, password)

      this.onStatus('connecting')

      // Attempt to connect using historical port first
      const backPort = this.getBackPort(device)

      if (backPort && ![5555].includes(backPort)) {
        try {
          await this.connectToDevice({
            ...device,
            port: backPort,
          })
          this.onStatus('connected')
          return {
            success: true,
            device,
          }
        }
        catch (error) {
          // The historical port connection failed. Continue to use the standard procedure
          console.log('Fallback port connection failed, trying standard flow')
        }
      }

      // Standard connection process
      try {
        const connectDevice = await this.waitForDeviceConnect(device)
        await this.connectToDevice(connectDevice)
      }
      catch (error) {
        this.onStatus('connecting-fallback')
        // Last attempt
        await this.connectToDevice({
          ...device,
          port: 5555,
        })
      }

      this.onStatus('connected')

      return {
        success: true,
        device,
      }
    }
    catch (error) {
      this.onStatus('error', error.message)
      return {
        success: false,
        error: error.message,
      }
    }
    finally {
      this.dispose()
    }
  }

  validateOptions(options) {
    if (!options?.adb) {
      throw new MonitorError(
        ERROR_CODES.INVALID_PARAMS,
        'Adb is required',
      )
    }
    if (!options?.password) {
      throw new MonitorError(
        ERROR_CODES.INVALID_PARAMS,
        'Password is required',
      )
    }
  }

  async scanForDevice() {
    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        this.dispose()
        reject(new MonitorError(
          ERROR_CODES.TIMEOUT,
          'Connection attempt timed out',
        ))
      }, MDNS_CONFIG.DEFAULT_TIMEOUT)

      this.deviceScanner.startScanning(
        MDNS_CONFIG.PAIRING_TYPE,
        (device) => {
          clearTimeout(timeoutHandle)
          resolve(device)
        },
      )
    })
  }

  async pairWithDevice(device, password) {
    try {
      await this.adb.pair(device.address, device.port, password)
    }
    catch (error) {
      throw new MonitorError(
        ERROR_CODES.PAIRING_FAILED,
        'Unable to pair with device',
      )
    }
  }

  async waitForDeviceConnect(device) {
    return new Promise((resolve, reject) => {
      const scanner = new DeviceScanner()

      const timeoutHandle = setTimeout(() => {
        scanner.dispose()
        reject(new MonitorError(
          ERROR_CODES.TIMEOUT,
          'Device connect timeout',
        ))
      }, MDNS_CONFIG.CONNECT_TIMEOUT)

      scanner.startScanning(
        MDNS_CONFIG.CONNECT_TYPE,
        (connectDevice) => {
          if (connectDevice.address === device.address) {
            clearTimeout(timeoutHandle)
            scanner.dispose()
            resolve(connectDevice)
          }
        },
      )
    })
  }

  async connectToDevice(device) {
    try {
      await this.adb.connect(device.address, device.port)
    }
    catch (error) {
      throw new MonitorError(
        ERROR_CODES.CONNECTION_FAILED,
        `Failed to connect to device: ${error.message}`,
      )
    }
  }

  getBackPort(device) {
    const devices = electronStore.get('device')

    const value = Object.entries(devices).reduce((port, [key, _]) => {
      if (key.includes(device.address)) {
        port = parseDeviceId(key).port
      }

      return port
    }, 5555)

    return value
  }

  dispose() {
    this.deviceScanner.dispose()
    this.isActive = false
  }
}

export default new AdbScanner()

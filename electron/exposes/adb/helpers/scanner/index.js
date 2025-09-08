import { Bonjour } from 'bonjour-service'
import net from 'node:net'
import appStore from '$electron/helpers/store.js'
import { parseDeviceId } from '$/utils/index.js'

export const MDNS_CONFIG = {
  PAIRING_TYPE: 'adb-tls-pairing',
  CONNECT_TYPE: 'adb-tls-connect',
  DEFAULT_TIMEOUT: 60 * 1000,
  CONNECT_TIMEOUT: 30 * 1000,
}

export const ERROR_CODES = {
  TIMEOUT: 'TIMEOUT',
  PAIRING_FAILED: 'PAIRING_FAILED',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  INVALID_PARAMS: 'INVALID_PARAMS',
}

export class DeviceData {
  constructor(name, address, port) {
    this.name = name
    this.address = address
    this.port = port
  }

  static fromMdnsService(service) {
    const ipv4Address = service.addresses?.find(addr => net.isIP(addr) === 4)
    if (!ipv4Address)
      return null

    return new DeviceData(
      service.name,
      ipv4Address,
      service.port,
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
  }

  async startScanning(type, callback) {
    this.bonjour = new Bonjour()

    return new Promise((resolve, reject) => {
      this.scanner = this.bonjour.find({ type }, (service) => {
        const device = DeviceData.fromMdnsService(service)
        if (device) {
          callback(device)
        }
      })
    })
  }

  dispose() {
    if (this.scanner) {
      this.scanner.stop()
      this.scanner = null
    }
    if (this.bonjour) {
      this.bonjour.destroy()
      this.bonjour = null
    }
  }
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

      // 先尝试使用历史端口连接
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
    const devices = appStore.get('device')

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

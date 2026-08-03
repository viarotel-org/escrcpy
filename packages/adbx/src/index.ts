import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import adbkit from '@devicefarmer/adbkit'
import { getAdbUtil, shellEscape } from '@escrcpy/shared'
import type { AdbxOptions, IAdbClient } from './types.js'

const AdbUtil = getAdbUtil(adbkit) as typeof adbkit.Adb.util

function getYadbPath(value: AdbxOptions['yadbPath']): string {
  return typeof value === 'function' ? value() || '' : value || ''
}

class YadbRunner {
  private readonly pushed = new Map<string, string>()
  constructor(private readonly adb: IAdbClient, private readonly path: AdbxOptions['yadbPath']) {}
  isAvailable(): boolean {
    const value = getYadbPath(this.path)
    return Boolean(value) && existsSync(value) && statSync(value).isFile()
  }

  async exec(serial: string, args: string[]): Promise<string> {
    await this.ensure(serial)
    return this.shell(serial, args, false) as Promise<string>
  }

  async execRaw(serial: string, args: string[]): Promise<Buffer> {
    await this.ensure(serial)
    return this.shell(serial, args, true) as Promise<Buffer>
  }

  private async ensure(serial: string): Promise<void> {
    const path = getYadbPath(this.path)
    if (!this.isAvailable())
      throw new Error('yadb binary is unavailable')
    const checksum = createHash('md5').update(readFileSync(path)).digest('hex')
    if (this.pushed.get(serial) === checksum)
      return
    const device = this.adb.getDevice(serial)
    const transfer = await device.push(path, '/data/local/tmp/yadb')
    await new Promise<void>((resolve, reject) => {
      transfer.once('end', resolve)
      transfer.once('error', reject)
    })
    this.pushed.set(serial, checksum)
  }

  private async shell(serial: string, args: string[], raw: boolean): Promise<string | Buffer> {
    const command = `app_process -Djava.class.path=/data/local/tmp/yadb /data/local/tmp com.ysbing.yadb.Main ${args.map(value => `'${shellEscape(value)}'`).join(' ')}`
    const result = await AdbUtil.readAll(await this.adb.getDevice(serial).shell(command) as never)
    return raw ? result : result.toString().trim()
  }
}

export function createAdbx(options: AdbxOptions) {
  const { adb } = options
  const yadb = new YadbRunner(adb, options.yadbPath)
  async function shell(serial: string, command: string): Promise<string> {
    return (await AdbUtil.readAll(await adb.getDevice(serial).shell(command) as never)).toString().trim()
  }

  async function screencap(serial: string): Promise<Buffer> {
    return AdbUtil.readAll(await adb.getDevice(serial).screencap() as never)
  }

  async function transfer(serial: string, local: string, remote: string): Promise<string> {
    const job = await adb.getDevice(serial).push(local, remote)
    await new Promise<void>((resolve, reject) => {
      job.once('end', resolve)
      job.once('error', reject)
    })
    return remote
  }
  async function getScreenSize(serial: string): Promise<{ width: number, height: number }> {
    const output = await shell(serial, 'wm size')
    const match = output.match(/Override size:\s*(\d+)x(\d+)/) ?? output.match(/Physical size:\s*(\d+)x(\d+)/)
    if (!match)
      throw new Error(`Failed to parse screen size: ${output}`)
    return { width: Number(match[1]), height: Number(match[2]) }
  }
  const input = {
    async tap(serial: string, x: number, y: number) {
      if (yadb.isAvailable())
        return yadb.exec(serial, ['-touch', String(x), String(y), '1']).then(() => undefined)
      await shell(serial, `input tap ${x} ${y}`)
    },
    async swipe(serial: string, x1: number, y1: number, x2: number, y2: number, duration = 300) {
      if (yadb.isAvailable())
        return yadb.exec(serial, ['-swipe', String(x1), String(y1), String(x2), String(y2), String(duration)]).then(() => undefined)
      await shell(serial, `input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`)
    },
    async longPress(serial: string, x: number, y: number, duration = 1000) {
      if (yadb.isAvailable())
        return yadb.exec(serial, ['-touch', String(x), String(y), String(duration)]).then(() => undefined)
      await shell(serial, `input swipe ${x} ${y} ${x} ${y} ${duration}`)
    },
    async drag(serial: string, x1: number, y1: number, x2: number, y2: number, duration = 1000) {
      if (!yadb.isAvailable())
        throw new Error('Drag gesture requires yadb')
      await yadb.exec(serial, ['-longPressDrag', String(x1), String(y1), String(x2), String(y2), '500', String(duration)])
    },
    async pinch(serial: string, x: number, y: number, scale: number) {
      if (!yadb.isAvailable())
        throw new Error('Pinch gesture requires yadb')
      await yadb.exec(serial, ['-pinch', String(x), String(y), String(scale)])
    },
    async text(serial: string, text: string) {
      if (yadb.isAvailable())
        return yadb.exec(serial, ['-keyboard', text]).then(() => undefined)
      await shell(serial, `input text '${shellEscape(text).replace(/ /g, '%s')}'`)
    },
    async key(serial: string, keyCode: number) {
      await shell(serial, `input keyevent ${keyCode}`)
    },
  }
  return {
    adb,
    yadb,
    shell,
    getDevice: (serial: string) => adb.getDevice(serial),
    getDevices: () => adb.listDevicesWithPaths(),
    screencap,
    push: transfer,
    pull: (serial: string, remote: string) => adb.getDevice(serial).pull(remote),
    install: (serial: string, path: string) => adb.getDevice(serial).install(path),
    uninstall: (serial: string, pkg: string) => adb.getDevice(serial).uninstall(pkg),
    isInstalled: (serial: string, pkg: string) => adb.getDevice(serial).isInstalled(pkg),
    input,
    screenshot: {
      async capture(serial: string): Promise<Buffer> {
        // TODO: There is a defect that the screenshot does not automatically adapt to the horizontal screen and appears with black filling.
        // if (yadb.isAvailable()) {
        //   const remotePath = '/data/local/tmp/yadb_screenshot.png'
        //   await yadb.exec(serial, ['-screenshot'])
        //   return AdbUtil.readAll(await adb.getDevice(serial).pull(remotePath) as never)
        // }
        return screencap(serial)
      },
      async captureToFile(serial: string, path: string) {
        await writeFile(path, await this.capture(serial))
      },
      async captureBase64(serial: string) {
        return (await this.capture(serial)).toString('base64')
      },
    },
    clipboard: {
      async read(serial: string) {
        if (!yadb.isAvailable())
          throw new Error('Clipboard requires yadb')
        return yadb.exec(serial, ['-readClipboard'])
      },
      async write(serial: string, text: string) {
        if (!yadb.isAvailable())
          throw new Error('Clipboard requires yadb')
        await yadb.exec(serial, ['-writeClipboard', text])
      },
    },
    ui: {
      async dumpLayout(serial: string): Promise<string> {
        if (yadb.isAvailable()) {
          const remotePath = '/data/local/tmp/yadb_layout_dump.xml'
          await yadb.exec(serial, ['-layout'])
          const xml = await shell(serial, `cat ${remotePath}`)
          await shell(serial, `rm -f ${remotePath}`).catch(() => {})
          return xml
        }
        const raw = await shell(serial, 'uiautomator dump /dev/tty')
        const xmlMatch = raw.match(/(<hierarchy[\s\S]*?<\/hierarchy>)/i)
        return xmlMatch ? xmlMatch[1] : raw
      },
    },
    fileManager: {
      push: transfer,
      pull: (serial: string, remote: string) => adb.getDevice(serial).pull(remote),
      async pullBuffer(serial: string, remote: string): Promise<Buffer> {
        return AdbUtil.readAll(await adb.getDevice(serial).pull(remote) as never)
      },
      readdir: (serial: string, dirPath: string) => adb.getDevice(serial).readdir(dirPath),
    },
    deviceInfo: {
      getScreenSize,
      async battery(serial: string) {
        return shell(serial, 'dumpsys battery')
      },
      async serialNo(serial: string) {
        return (await shell(serial, 'getprop ro.serialno')).trim()
      },
      async getProperty(serial: string, prop: string) {
        return (await shell(serial, `getprop ${prop}`)).trim()
      },
      async getOrientation(serial: string): Promise<number> {
        try {
          const output = await shell(serial, 'dumpsys display | grep mCurrentOrientation')
          const match = output.match(/mCurrentOrientation=(\d)/)
          if (!match)
            return 0
          const value = Number.parseInt(match[1], 10)
          return (value >= 0 && value <= 3) ? value : 0
        }
        catch { return 0 }
      },
      async getBatteryLevel(serial: string): Promise<number> {
        const output = await shell(serial, 'dumpsys battery')
        const match = output.match(/level:\s*(\d+)/)
        return match ? Number.parseInt(match[1], 10) : -1
      },
    },
    connection: {
      watch: () => adb.trackDevices(),
      kill: (...args: unknown[]) => adb.kill(...args),
    },
  }
}

export type Adbx = ReturnType<typeof createAdbx>
export type { AdbxEntry, AdbxOptions, IAdbClient, IAdbDevice } from './types.js'

import type { Readable } from 'node:stream'

export interface AdbxEntry {
  name: string
  size: number
  mode: number
  mtime: Date
}

export interface IAdbDevice {
  shell(command: string): Promise<Readable>
  screencap(): Promise<Readable>
  push(localPath: string, remotePath: string): Promise<NodeJS.EventEmitter>
  pull(remotePath: string): Promise<Readable>
  readdir(dirPath: string): Promise<AdbxEntry[]>
  install(path: string): Promise<boolean>
  uninstall(pkg: string): Promise<boolean>
  isInstalled(pkg: string): Promise<boolean>
  tcpip(port: number): Promise<unknown>
  waitForDevice(): Promise<unknown>
}
export interface IAdbClient {
  getDevice(serial: string): IAdbDevice
  listDevicesWithPaths(): Promise<Array<{ id: string, type: string, [key: string]: unknown }>>
  version(): Promise<number>
  kill(...args: unknown[]): Promise<unknown>
  trackDevices(): Promise<NodeJS.EventEmitter>
}
export interface AdbxOptions { adb: IAdbClient, yadbPath?: string | (() => string | undefined) }

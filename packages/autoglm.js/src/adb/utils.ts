import { exec } from 'tinyexec'

/**
 * Get ADB command prefix with optional device specifier.
 */
export function getAdbPrefix(deviceId?: string): string[] {
  return deviceId ? ['adb', '-s', deviceId] : ['adb']
}

export async function runAdbCommand(deviceId?: string, ...args: string[]) {
  const prefix = getAdbPrefix(deviceId)
  return await exec(prefix[0], [...prefix.slice(1), ...args])
}

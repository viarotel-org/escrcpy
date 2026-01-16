import { APP_PACKAGES } from '@/constants/app'
import { runAdbCommand } from './utils'

/**
 * Merge custom apps with built-in APP_PACKAGES.
 * Custom apps have higher priority.
 */
function mergeAppPackages(customApps?: Record<string, string>): Record<string, string> {
  if (!customApps || Object.keys(customApps).length === 0) {
    return APP_PACKAGES
  }
  return { ...APP_PACKAGES, ...customApps }
}

/**
 * Get the currently focused app name.
 */
export async function getCurrentApp(deviceId?: string, customApps?: Record<string, string>): Promise<string> {
  const result = await runAdbCommand(deviceId, ['shell', 'dumpsys', 'window'])
  const output = result.stdout

  const appPackages = mergeAppPackages(customApps)

  // Parse window focus info
  for (const line of output.split('\n')) {
    if (line.includes('mCurrentFocus') || line.includes('mFocusedApp')) {
      for (const [appName, appPackage] of Object.entries(appPackages)) {
        if (line.includes(appPackage)) {
          return appName
        }
      }
    }
  }

  return 'System Home'
}

/**
 * Tap at the specified coordinates.
 */
export async function tap(x: number, y: number, deviceId?: string, delay: number = 1.0): Promise<void> {
  await runAdbCommand(deviceId, ['shell', 'input', 'tap', x.toString(), y.toString()])
  await new Promise(resolve => setTimeout(resolve, delay * 1000))
}

/**
 * Double tap at the specified coordinates.
 */
export async function doubleTap(x: number, y: number, deviceId?: string, delay: number = 1.0): Promise<void> {
  await runAdbCommand(deviceId, ['shell', 'input', 'tap', x.toString(), y.toString()])
  await new Promise(resolve => setTimeout(resolve, 100))
  await runAdbCommand(deviceId, ['shell', 'input', 'tap', x.toString(), y.toString()])
  await new Promise(resolve => setTimeout(resolve, delay * 1000))
}

/**
 * Long press at the specified coordinates.
 */
export async function longPress(
  x: number,
  y: number,
  durationMs: number = 3000,
  deviceId?: string,
  delay: number = 1.0,
): Promise<void> {
  await runAdbCommand(deviceId, ['shell', 'input', 'swipe', x.toString(), y.toString(), x.toString(), y.toString(), durationMs.toString()])
  await new Promise(resolve => setTimeout(resolve, delay * 1000))
}

/**
 * Swipe from start to end coordinates.
 */
export async function swipe(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  durationMs?: number,
  deviceId?: string,
  delay: number = 1.0,
): Promise<void> {
  // Calculate duration if not provided
  if (durationMs === undefined) {
    const distSq = (startX - endX) ** 2 + (startY - endY) ** 2
    durationMs = Math.max(1000, Math.min(Math.floor(distSq / 1000), 2000))
  }

  await runAdbCommand(deviceId, ['shell', 'input', 'swipe', startX.toString(), startY.toString(), endX.toString(), endY.toString(), durationMs.toString()])
  await new Promise(resolve => setTimeout(resolve, delay * 1000))
}

/**
 * Press the back button.
 */
export async function back(deviceId?: string, delay: number = 1.0): Promise<void> {
  await runAdbCommand(deviceId, ['shell', 'input', 'keyevent', '4'])
  await new Promise(resolve => setTimeout(resolve, delay * 1000))
}

/**
 * Press the home button.
 */
export async function home(deviceId?: string, delay: number = 1.0): Promise<void> {
  await runAdbCommand(deviceId, ['shell', 'input', 'keyevent', 'KEYCODE_HOME'])
  await new Promise(resolve => setTimeout(resolve, delay * 1000))
}

/**
 * Launch an app by name.
 */
export async function launchApp(
  appName: string,
  deviceId?: string,
  delay: number = 1.0,
  customApps?: Record<string, string>,
): Promise<boolean> {
  const appPackages = mergeAppPackages(customApps)

  if (!appPackages[appName]) {
    return false
  }

  const appPackage = appPackages[appName]

  await runAdbCommand(deviceId, ['shell', 'monkey', '-p', appPackage, '-c', 'android.intent.category.LAUNCHER', '1'])
  await new Promise(resolve => setTimeout(resolve, delay * 1000))
  return true
}

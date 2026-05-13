import { quote } from 'shell-quote'
import { mergeConfig } from '$/store/preference/helpers/index.js'
import { getLaunchConfig } from '$/utils/launch/index.js'

export function useStartApp() {
  const deviceStore = useDeviceStore()
  const preferenceStore = usePreferenceStore()
  const loading = ref(false)
  const env = getEnv()

  function getEnv() {
    return window.$preload.process.env
  }

  function quoteShellValue(value = '') {
    return quote([String(value)])
  }

  function normalizeActivity(activity = '', packageName = '') {
    if (!activity) {
      return ''
    }

    if (activity.includes('/')) {
      return activity
    }

    return `${packageName}/${activity}`
  }

  function normalizeBoolean(value = false) {
    if (typeof value === 'boolean') {
      return value
    }

    if (typeof value === 'number') {
      return value !== 0
    }

    if (typeof value === 'string') {
      return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase())
    }

    return false
  }

  function normalizeUserId(userId = '') {
    const value = String(userId).trim()

    if (!/^\d+$/.test(value)) {
      return ''
    }

    return value
  }

  function shouldUseNewDisplay(useNewDisplay) {
    return useNewDisplay !== false
  }

  function isSecondaryUserLaunch({ userId, packageName }) {
    return Boolean(packageName) && !['', '0'].includes(normalizeUserId(userId))
  }

  function parseDisplaySize(rawText = '') {
    const match = rawText.match(/Override size:\s*(\d+)x(\d+)/i)
      || rawText.match(/Physical size:\s*(\d+)x(\d+)/i)

    if (!match) {
      return null
    }

    return {
      width: Number.parseInt(match[1], 10),
      height: Number.parseInt(match[2], 10),
    }
  }

  function parseDisplayDensity(rawText = '') {
    const match = rawText.match(/Override density:\s*(\d+)/i)
      || rawText.match(/Physical density:\s*(\d+)/i)

    if (!match) {
      return null
    }

    return Number.parseInt(match[1], 10)
  }

  async function resolveLandscapeDisplay(deviceId) {
    const output = await window.$preload.adb.deviceShell(deviceId, 'wm size; wm density').catch(() => '')
    const size = parseDisplaySize(output)

    if (!size) {
      return ''
    }

    const width = Math.max(size.width, size.height)
    const height = Math.min(size.width, size.height)
    const density = parseDisplayDensity(output)

    return density
      ? `${width}x${height}/${density}`
      : `${width}x${height}`
  }

  async function resolveSecondaryUserActivity(deviceId, userId, packageName) {
    if (!packageName) {
      return ''
    }

    const output = await window.$preload.adb.deviceShell(
      deviceId,
      `cmd package resolve-activity --brief --components --user ${userId} ${quoteShellValue(packageName)}`,
    )

    return output
      .split(/\r?\n/)
      .map(line => line.trim())
      .find(line => line.includes('/')) || ''
  }

  async function openSecondaryUserApp({ deviceId, userId, packageName, activity, displayId }) {
    const resolvedActivity = activity || await resolveSecondaryUserActivity(deviceId, userId, packageName)
    const componentName = normalizeActivity(resolvedActivity, packageName)
    const displayArgs = displayId ? ` --display ${displayId}` : ''

    if (!componentName) {
      throw new Error(`No launchable activity found for ${packageName} (user ${userId})`)
    }

    return window.$preload.adb.deviceShell(
      deviceId,
      `am start-activity --user ${userId}${displayArgs} -n ${quoteShellValue(componentName)}`,
    )
  }

  function resolveStartOptions(options = {}) {
    const deviceId = env.EXECUTE_ARG_DEVICE_ID || options.deviceId
    const appName = env.EXECUTE_ARG_APP_NAME || options.appName
    const activity = env.EXECUTE_ARG_ACTIVITY || options.activity
    const userId = normalizeUserId(env.EXECUTE_ARG_USER_ID || options.userId)
    const landscape = normalizeBoolean(env.EXECUTE_ARG_LANDSCAPE || options.landscape)
    const packageName = env.EXECUTE_ARG_PACKAGE_NAME || options.packageName
    const useNewDisplay = options.useNewDisplay

    return {
      deviceId,
      appName,
      activity,
      userId,
      landscape,
      packageName,
      useNewDisplay,
      shouldCreateNewDisplay: shouldUseNewDisplay(useNewDisplay),
    }
  }

  async function resolveScrcpyRuntime({ deviceId, userId, appName, landscape, shouldCreateNewDisplay, packageName }) {
    await window.$preload.adb.waitForDevice(deviceId)
    await deviceStore.getList()

    const title = `${appName}-${deviceStore.getLabel(deviceId, 'synergy')}`
    const deviceConfig = preferenceStore.getData(deviceId) || {}
    const launchConfig = getLaunchConfig({ deviceId, packageName, userId, scope: 'scrcpy' }) || {}
    const mergedConfig = mergeConfig(deviceConfig, launchConfig)

    if (landscape) {
      const tempWindowWidth = mergedConfig['--window-width']
      mergedConfig['--window-width'] = mergedConfig['--window-height']
      mergedConfig['--window-height'] = tempWindowWidth
    }

    const commands = preferenceStore.scrcpyParameter(mergedConfig, {
      excludes: ['--otg', '--mouse=aoa', '--keyboard=aoa'],
    })

    const newDisplay = landscape && shouldCreateNewDisplay
      ? await resolveLandscapeDisplay(deviceId)
      : ''

    return {
      title,
      commands,
      newDisplay,
    }
  }

  function buildScrcpyOptions(options, startOptions, runtime, overrides = {}) {
    return {
      ...options,
      title: runtime.title,
      commands: runtime.commands,
      packageName: startOptions.packageName,
      userId: startOptions.userId,
      activity: startOptions.activity,
      landscape: startOptions.landscape,
      newDisplay: runtime.newDisplay,
      useNewDisplay: startOptions.useNewDisplay,
      ...overrides,
    }
  }

  async function launchScrcpy(deviceId, options) {
    try {
      return await window.$preload.scrcpy.launch(deviceId, options)
    }
    catch (error) {
      console.error('mirror.commands', options.commands)
      console.error('mirror.error', error)
      throw error
    }
  }

  async function openSecondaryUserAppWithMirror(startOptions, scrcpyOptions) {
    if (!startOptions.shouldCreateNewDisplay) {
      await openSecondaryUserApp(startOptions)
      await launchScrcpy(startOptions.deviceId, scrcpyOptions)
      return
    }

    const displayId = await launchScrcpy(startOptions.deviceId, scrcpyOptions)

    await openSecondaryUserApp({
      ...startOptions,
      displayId,
    })
  }

  async function open(options = {}) {
    const startOptions = resolveStartOptions(options)

    if (!startOptions.deviceId) {
      return false
    }

    loading.value = true

    try {
      const runtime = await resolveScrcpyRuntime(startOptions)

      if (isSecondaryUserLaunch(startOptions)) {
        const scrcpyOptions = buildScrcpyOptions(options, startOptions, runtime, {
          packageName: '',
        })

        await openSecondaryUserAppWithMirror(startOptions, scrcpyOptions)
        return
      }

      const scrcpyOptions = buildScrcpyOptions(options, startOptions, runtime)
      await launchScrcpy(startOptions.deviceId, scrcpyOptions)
    }
    catch (error) {
      console.error('startApp.error', error)

      if (error?.message) {
        ElMessage.warning(error.message)
      }
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    env,
    open,
  }
}

export default useStartApp

export function useStartApp() {
  const deviceStore = useDeviceStore()
  const preferenceStore = usePreferenceStore()
  const loading = ref(false)
  const env = getEnv()

  function getEnv() {
    return window.$preload.process.env
  }

  function quoteShellValue(value = '') {
    return `"${String(value).replaceAll('"', '\\"')}"`
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

  async function open(options = {}) {
    const deviceId = options.deviceId || env.EXECUTE_ARG_DEVICE_ID
    const appName = options.appName || env.EXECUTE_ARG_APP_NAME
    const activity = options.activity || env.EXECUTE_ARG_ACTIVITY
    const userId = options.userId || env.EXECUTE_ARG_USER_ID
    const landscape = normalizeBoolean(options.landscape ?? env.EXECUTE_ARG_LANDSCAPE)
    let packageName = options.packageName || env.EXECUTE_ARG_PACKAGE_NAME
    let useNewDisplay = options.useNewDisplay

    if (!deviceId) {
      return false
    }

    loading.value = true

    try {
      await window.$preload.adb.waitForDevice(deviceId)

      await deviceStore.getList()

      const title = `${appName}-${deviceStore.getLabel(deviceId, 'synergy')}`

      const commands = preferenceStore.scrcpyParameter(deviceId, {
        excludes: ['--otg', '--mouse=aoa', '--keyboard=aoa'],
      })
      const newDisplay = landscape && useNewDisplay !== false
        ? await resolveLandscapeDisplay(deviceId)
        : ''

      if (userId && packageName) {
        if (useNewDisplay === false) {
          await openSecondaryUserApp({
            deviceId,
            userId,
            packageName,
            activity,
          })

          await window.$preload.scrcpy.launch(deviceId, {
            ...options,
            title,
            commands,
            packageName: '',
            userId,
            activity,
            landscape,
            newDisplay,
            useNewDisplay,
          })
        }
        else {
          const displayId = await window.$preload.scrcpy.launch(deviceId, {
            ...options,
            title,
            commands,
            packageName: '',
            userId,
            activity,
            landscape,
            newDisplay,
            useNewDisplay,
          })

          await openSecondaryUserApp({
            deviceId,
            userId,
            packageName,
            activity,
            displayId,
          })
        }
      }
      else {
        await window.$preload.scrcpy.launch(deviceId, {
          ...options,
          title,
          commands,
          packageName,
          userId,
          activity,
          landscape,
          newDisplay,
          useNewDisplay,
        })
          .catch((e) => {
            console.error('mirror.commands', commands)
            console.error('mirror.error', e)
            if (e.message) {
              ElMessage.warning(e.message)
            }
          })
      }
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

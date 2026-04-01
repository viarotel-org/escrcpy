import { sleep } from '$/utils'

const COMMANDS = {
  disableAccelerometer:
    'content insert --uri content://settings/system --bind name:s:accelerometer_rotation --bind value:i:0',
  vertically:
    'content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:0',
  horizontally:
    'content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:1',
}

/**
 * Composable for toggling device orientation between portrait and landscape.
 *
 * @param {object} options
 * @param {(command: string) => Promise<void>} options.execShell
 *   Callback that executes an ADB shell command. In single-device context this
 * @param {import('vue').Ref<boolean>} [options.initialLandscape] - optional initial state
 */
export function useDeviceRotation({ execShell, initialLandscape } = {}) {
  const isLandscape = ref(initialLandscape?.value ?? false)
  const loading = ref(false)

  async function toggle() {
    if (loading.value)
      return
    loading.value = true
    try {
      await execShell(COMMANDS.disableAccelerometer)
      await sleep(500)
      const target = !isLandscape.value
      await execShell(target ? COMMANDS.horizontally : COMMANDS.vertically)
      isLandscape.value = target
    }
    finally {
      loading.value = false
    }
  }

  return { isLandscape, loading, toggle }
}

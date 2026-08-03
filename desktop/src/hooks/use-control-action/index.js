import { sleep } from '$/utils/index.js'
import { ShortcutOperationTypes } from '$/hooks/use-shortcut-actions/constants/index.js'

const COMMAND_MAP = {
  [ShortcutOperationTypes.SWITCH]: 'input keyevent 187',
  [ShortcutOperationTypes.HOME]: 'input keyevent 3',
  [ShortcutOperationTypes.BACK]: 'input keyevent 4',
  [ShortcutOperationTypes.NOTIFICATION]: 'cmd statusbar expand-notifications',
  [ShortcutOperationTypes.POWER]: 'input keyevent 26',
  [ShortcutOperationTypes.REBOOT]: 'reboot',
  [ShortcutOperationTypes.ROTATION_PORTRAIT]: 'content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:0',
  [ShortcutOperationTypes.ROTATION_LANDSCAPE]: 'content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:1',
  [ShortcutOperationTypes.ROTATION_AUTO]: 'content insert --uri content://settings/system --bind name:s:accelerometer_rotation --bind value:i:1',
  [ShortcutOperationTypes.ROTATION_DISABLE]: 'content insert --uri content://settings/system --bind name:s:accelerometer_rotation --bind value:i:0',
  [ShortcutOperationTypes.VOLUME_UP]: 'input keyevent 24',
  [ShortcutOperationTypes.VOLUME_DOWN]: 'input keyevent 25',
  [ShortcutOperationTypes.VOLUME_MUTE]: 'input keyevent 164',
}

const DISABLE_ROTATION_COMMAND = 'content insert --uri content://settings/system --bind name:s:accelerometer_rotation --bind value:i:0'

export function useControlCommandAction() {
  const loading = ref(false)

  async function invoke(input, options = {}) {
    const devices = Array.isArray(input) ? input : [input]
    const commandId = options.commandId || options.value

    if (!commandId) {
      ElMessage.warning(window.t('common.select.please'))
      return false
    }

    loading.value = true
    try {
      for (const device of devices.filter(Boolean)) {
        await executeCommand(device, commandId)
      }
    }
    finally {
      loading.value = false
    }
  }

  async function executeCommand(device, commandId) {
    const deviceId = device?.id || device

    const command = COMMAND_MAP[commandId]

    if (!command) {
      return false
    }

    if (commandId === 'rotation-portrait' || commandId === 'rotation-landscape') {
      await window.$preload.adb.deviceShell(deviceId, DISABLE_ROTATION_COMMAND)
      await sleep(500)
    }

    return window.$preload.adb.deviceShell(deviceId, command)
  }

  return {
    executeCommand,
    invoke,
    loading,
  }
}

export default useControlCommandAction

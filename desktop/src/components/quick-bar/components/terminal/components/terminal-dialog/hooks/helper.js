import { textFormatter } from 'vue-command'

export function useFixCursor(history) {
  const length = history.value.length
  if (history.value[length - 1]?.__name === 'VueCommandQuery') {
    history.value.splice(length - 1, 1, textFormatter('Waiting...'))
  }
}

export async function useSystemTerminal(command) {
  const enableSystemTerminal = window.$preload.store.get('common.enableSystemTerminal')

  if (!enableSystemTerminal) {
    return false
  }

  try {
    await window.$preload.terminal.openSystemTerminal({
      command,
    })
  }
  catch (error) {
    console.error('Failed to open system terminal:', error)
    ElMessage.error(error.message || 'Failed to open system terminal')
  }

  throw new Error('System terminal is enabled')
}

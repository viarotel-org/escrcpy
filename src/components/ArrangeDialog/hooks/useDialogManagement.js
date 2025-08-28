import { nextTick } from 'vue'

/**
 * Dialog management composable
 * Handles dialog opening, closing, and initialization
 */
export function useDialogManagement(visible, arrangedWidgets, loadDevices, loadLayout) {
  const close = () => {
    visible.value = false
  }

  const open = async () => {
    try {
      visible.value = true
      await nextTick()

      loadDevices()
      loadLayout()
    }
    catch (error) {
      console.error('Failed to open arrange dialog:', error)
      ElMessage.error('Failed to initialize dialog')
    }
  }

  const onClosed = () => {
    arrangedWidgets.value = []
  }

  return {
    open,
    close,
    onClosed,
  }
}

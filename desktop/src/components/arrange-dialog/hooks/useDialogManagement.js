/**
 * Dialog management composable
 * Handles dialog opening, closing, and initialization
 */
export function useDialogManagement(dialog, arrangedWidgets, loadDevices, loadLayout) {
  function close() {
    dialog.close()
  }

  async function open(options) {
    dialog.open(options)
    await nextTick()

    loadDevices()
    loadLayout()
  }

  function onClosed() {
    arrangedWidgets.value = []
    dialog.options?.onClosed?.()
  }

  return {
    open,
    close,
    onClosed,
  }
}

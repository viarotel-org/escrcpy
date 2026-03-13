/**
 * Dialog management composable
 * Handles dialog opening, closing, and initialization
 */
export function useDialogManagement(dialog, arrangedWidgets, loadDevices, loadLayout) {
  async function open(options) {
    dialog.open(options)

    await nextTick()

    await loadDevices()
  }

  async function onOpened() {
    await nextTick()

    await loadLayout()
  }

  function close() {
    dialog.close()
  }

  function onClosed() {
    arrangedWidgets.value = []
    dialog.options?.onClosed?.()
  }

  return {
    open,
    onOpened,
    close,
    onClosed,
  }
}

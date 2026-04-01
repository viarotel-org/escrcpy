import { sleep } from '$/utils/index.js'

export function useDialogManagement(options) {
  const {
    dialog,
    arrangedWidgets,
    loadDevices,
    loadLayout,
  } = options || {}

  async function open(options) {
    dialog.loading = true

    await loadDevices()

    dialog.open(options)

    await nextTick()

    await sleep()

    await loadLayout()

    dialog.loading = false
  }

  async function onOpened() {

  }

  function close() {
    dialog.close()
  }

  function onClosed() {
    arrangedWidgets.value = []
    dialog.options?.onClosed?.()
  }

  return {
    dialog,
    open,
    onOpened,
    close,
    onClosed,
  }
}

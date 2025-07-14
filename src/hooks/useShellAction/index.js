import { selectAndSendFileToDevice } from '$/utils/device/index.js'
import { allSettledWrapper } from '$/utils/index.js'

export function useShellAction() {
  const taskStore = useTaskStore()

  const loading = ref(false)

  async function invoke(...args) {
    const [devices] = args

    if (Array.isArray(devices)) {
      return multipleInvoke(...args)
    }

    return singleInvoke(...args)
  }

  async function singleInvoke(device, { files, actionType } = {}) {
    loading.value = true

    if (!files) {
      try {
        files = await selectAndSendFileToDevice(device.id, {
          extensions: ['sh'],
          selectText: window.t('device.control.terminal.script.select'),
          loadingText: window.t('device.control.terminal.script.push.loading'),
          successText: window.t('device.control.terminal.script.push.success'),
        })
      }
      catch (error) {
        loading.value = false
        ElMessage.warning(error.message)
        return false
      }
    }

    const filePath = files[0]

    const command = `adb -s ${device.id} shell sh ${filePath}`

    taskStore.emit('terminal', { command, message: window.t('device.control.terminal.script.enter') })

    loading.value = false
  }

  async function multipleInvoke(devices, { files } = {}) {
    loading.value = true

    if (!files) {
      try {
        files = await window.electron.ipcRenderer.invoke('show-open-dialog', {
          properties: ['openFile'],
          filters: [
            {
              name: window.t('device.control.terminal.script.select'),
              extensions: ['sh'],
            },
          ],
        })
      }
      catch (error) {
        if (error.message) {
          const message = error.message?.match(/Error: (.*)/)?.[1]
          ElMessage.warning(message || error.message)
        }

        loading.value = false
        return false
      }
    }

    const closeLoading = ElMessage.loading(
      window.t('device.control.terminal.script.push.loading'),
    ).close

    const failFiles = []

    await allSettledWrapper(devices, async (device) => {
      const successFiles = await selectAndSendFileToDevice(device.id, {
        files,
        silent: true,
      }).catch((e) => {
        console.warn(e.message)
        failFiles.push(e.message)
      })

      const filePath = successFiles?.[0]

      if (filePath) {
        window.adb.deviceShell(device.id, `sh ${filePath}`)
      }
    })

    if (failFiles.length) {
      ElMessageBox.alert(
        `<div>${failFiles.map(text => `${text}<br/>`).join('')}</div>`,
        window.t('common.tips'),
        {
          type: 'warning',
          dangerouslyUseHTMLString: true,
        },
      )
      loading.value = false
      return false
    }

    closeLoading()

    await ElMessage.success(window.t('device.control.terminal.script.success'))

    loading.value = false
  }

  return {
    invoke,
    loading,
    singleInvoke,
    multipleInvoke,
  }
}

export default useShellAction

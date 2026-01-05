import { allSettledWrapper } from '$/utils'

export function useInstallAction() {
  const deviceStore = useDeviceStore()

  const loading = ref(false)

  function invoke(...args) {
    const [devices] = args

    if (Array.isArray(devices)) {
      return multipleInvoke(...args)
    }

    return singleInvoke(...args)
  }

  async function selectFiles() {
    try {
      const files = await window.electron.ipcRenderer.invoke(
        'show-open-dialog',
        {
          properties: ['openFile', 'multiSelections'],
          filters: [
            {
              name: window.t('device.control.install.placeholder'),
              extensions: ['apk'],
            },
          ],
        },
      )

      return files
    }
    catch (error) {
      const message = error.message?.match(/Error: (.*)/)?.[1] || error.message
      throw new Error(message)
    }
  }

  async function singleInvoke(device, { files, silent = false } = {}) {
    if (!files) {
      try {
        files = await selectFiles()
      }
      catch (error) {
        ElMessage.warning(error.message)
        return false
      }
    }

    let closeLoading = null
    if (!silent) {
      closeLoading = ElMessage.loading(
        window.t('device.control.install.progress', {
          deviceName: deviceStore.getLabel(device),
        }),
      ).close
    }

    let failCount = 0

    await allSettledWrapper(files, (item) => {
      return window.adb.install(device.id, item).catch((e) => {
        console.warn(e)
        ++failCount
      })
    })

    if (silent) {
      return false
    }

    closeLoading()

    const totalCount = files.length
    const successCount = totalCount - failCount

    if (successCount) {
      if (totalCount > 1) {
        ElMessage.success(
          window.t('device.control.install.success', {
            deviceName: deviceStore.getLabel(device),
            totalCount,
            successCount,
            failCount,
          }),
        )
      }
      else {
        ElMessage.success(
          window.t('device.control.install.success.single', {
            deviceName: deviceStore.getLabel(device),
          }),
        )
      }
      return false
    }

    ElMessage.warning(window.t('device.control.install.error'))
  }

  async function multipleInvoke(devices, { files } = {}) {
    if (!files) {
      try {
        files = await selectFiles()
      }
      catch (error) {
        ElMessage.warning(error.message)
        return false
      }
    }

    loading.value = true

    const closeMessage = ElMessage.loading(
      window.t('device.control.install.progress', {
        deviceName: window.t('common.device'),
      }),
    ).close

    await allSettledWrapper(devices, (item) => {
      return singleInvoke(item, {
        files,
        silent: true,
      })
    })

    closeMessage()

    ElMessage.success(window.t('common.success.batch'))

    loading.value = false
  }

  return {
    invoke,
    loading,
    deviceStore,
    selectFiles,
    multipleInvoke,
    singleInvoke,
  }
}

export default useInstallAction

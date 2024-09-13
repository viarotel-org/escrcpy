import { allSettledWrapper, sleep } from '$/utils'
import { ElMessage } from 'element-plus'
/**
 * 选择并将文件发送到设备
 */
export async function selectAndSendFileToDevice(
  deviceId,
  {
    files,
    multiSelections = false,
    silent = false,
    extensions = ['*'],
    selectText = window.t('device.control.file.push.placeholder'),
    loadingText = window.t('device.control.file.push.loading'),
    successText = window.t('device.control.file.push.success.name'),
  } = {},
) {
  if (!files) {
    try {
      const properties = ['openFile']

      if (multiSelections) {
        properties.push('multiSelections')
      }

      files = await window.electron.ipcRenderer.invoke('show-open-dialog', {
        properties,
        filters: [
          {
            name: selectText,
            extensions,
          },
        ],
      })
    }
    catch (error) {
      throw new Error(error.message?.match(/Error: (.*)/)?.[1] || error.message)
    }
  }

  let closeLoading
  if (!silent) {
    closeLoading = ElMessage.loading(`${deviceId}: ${loadingText}`).close
  }

  const successFiles = []
  const failFiles = []

  await allSettledWrapper(files, async (item) => {
    const ret = await window.adbkit.push(deviceId, item).catch((e) => {
      console.warn(e?.message)
      failFiles.push(`${deviceId}-${item}`)
    })

    if (ret) {
      successFiles.push(ret)
    }
  })

  await sleep()

  if (failFiles.length) {
    closeLoading?.()
    throw new Error(`Push file failed: ${failFiles.join(',')}`)
  }

  closeLoading?.()

  if (!silent) {
    ElMessage.success({ message: successText, grouping: true })
  }

  return successFiles
}

export function openFloatControl(deviceInfo) {
  const floatControl = window.appStore.get('common.floatControl')

  if (!floatControl) {
    return false
  }

  window.electron.ipcRenderer.invoke('open-control-window', deviceInfo)
}

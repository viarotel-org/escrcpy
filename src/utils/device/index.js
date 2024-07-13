import { ElMessage } from 'element-plus'
import { allSettledWrapper } from '$/utils'
/**
 * 选择并将文件发送到设备
 */
export async function selectAndSendFileToDevice(
  deviceId,
  {
    files,
    multiSelections = false,
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

  const closeMessage = ElMessage.loading(loadingText).close

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

  if (failFiles.length) {
    closeMessage()
    throw new Error(`Push file failed: ${failFiles.join(',')}`)
  }

  closeMessage()

  ElMessage.success({ message: successText, grouping: true })

  return successFiles
}

import { allSettledWrapper, sleep } from '$/utils'

export * from './migrator/index.js'

export * from './qr/index.js'
export * from './selection/index.js'
export { parseDeviceId } from '@escrcpy/shared'

/**
 * Select files and push them to a device
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

      files = await window.$preload.ipcRenderer.invoke('show-open-dialog', {
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
    const ret = await window.$preload.adb.push(deviceId, item).catch((e) => {
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

export function openFloatControl(device) {
  const floatControl = window.$preload.store.get('common.floatControl')

  if (!floatControl) {
    return false
  }

  window.$preload.win.open('pages/control', { device })
  return true
}

export function removeDevices(...devices) {
  const storeDevices = { ...(window.$preload.store.get('device') || {}) }

  for (const device of devices) {
    delete storeDevices[device.id ?? device]
  }

  window.$preload.store.set('device', storeDevices)
}

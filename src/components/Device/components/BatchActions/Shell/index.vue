<template>
  <div class="" @click="handleClick(devices)">
    <slot v-bind="{ loading }" />
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { selectAndSendFileToDevice } from '$/utils/device/index.js'
import { allSettledWrapper } from '$/utils'

const props = defineProps({
  devices: {
    type: Object,
    default: () => null,
  },
})

const loading = ref(false)

async function handleClick(devices) {
  let files = null

  try {
    files = await window.electron.ipcRenderer.invoke('show-open-dialog', {
      properties: ['openFile'],
      filters: [
        {
          name: window.t('device.control.shell.select'),
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
    return false
  }

  loading.value = true

  const closeLoading = ElMessage.loading(
    window.t('device.control.shell.push.loading'),
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
      window.adbkit.deviceShell(device.id, `sh ${filePath}`)
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

  await ElMessage.success(window.t('device.control.shell.success'))

  loading.value = false
}
</script>

<style></style>

<template>
  <div class="" @click="handleClick(device)">
    <slot :loading="loading" />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const props = defineProps({
  device: {
    type: Object,
    default: () => null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const invokeTerminal = inject('invokeTerminal')

async function handleClick(device) {
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

  const closeMessage = ElMessage.loading(
    window.t('device.control.shell.pushing'),
  ).close

  const filePath = files[0]

  let pushFilePath = ''

  try {
    pushFilePath = await window.adbkit.push(device.id, filePath)
  }
  catch (error) {
    closeMessage()
    ElMessage.warning(error.message)
    return false
  }

  if (!pushFilePath) {
    closeMessage()
    ElMessage.warning('Push script failed')
    return false
  }

  await window.adbkit.deviceShell(device.id, `sh ${pushFilePath}`)

  closeMessage()

  await ElMessage.success(window.t('device.control.shell.success'))

  const command = `adb -s ${device.id} shell sh ${pushFilePath}`

  invokeTerminal(command)
}
</script>

<style></style>

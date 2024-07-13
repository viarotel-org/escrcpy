<template>
  <div class="" @click="handleClick(device)">
    <slot :loading="loading" />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { selectAndSendFileToDevice } from '$/utils/device/index.js'

const props = defineProps({
  device: {
    type: Object,
    default: () => null,
  },
})

const loading = ref(false)

const invokeTerminal = inject('invokeTerminal')

async function handleClick(device) {
  let files = null

  loading.value = true

  try {
    files = await selectAndSendFileToDevice(device.id, {
      extensions: ['sh'],
      selectText: window.t('device.control.shell.select'),
      loadingText: window.t('device.control.shell.push.loading'),
      successText: window.t('device.control.shell.push.success'),
    })
  }
  catch (error) {
    loading.value = false
    ElMessage.warning(error.message)
    return false
  }

  const filePath = files[0]

  const command = `adb -s ${device.id} shell sh ${filePath}`

  invokeTerminal(command)

  loading.value = false
}
</script>

<style></style>

<template>
  <el-dropdown :hide-on-click="false" :disabled="loading">
    <div class="">
      <slot :loading="loading" />
      <FileManageProxy ref="fileManageProxyRef" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handlePush(devices)">
          <span class="" title="/sdcard/Download/">
            {{ $t('device.control.file.push') }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import FileManageProxy from '$/components/Device/components/ControlBar/FileManage/index.vue'

import { selectAndSendFileToDevice } from '$/utils/device/index.js'
import { allSettledWrapper } from '$/utils'

const props = defineProps({
  devices: {
    type: Object,
    default: () => null,
  },
})

const loading = ref(false)

const fileManageProxyRef = ref(null)

async function handlePush(devices) {
  let files = null

  try {
    files = await window.electron.ipcRenderer.invoke('show-open-dialog', {
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: window.t('device.control.file.push.placeholder'),
          extensions: ['*'],
        },
      ],
    })
  }
  catch (error) {
    if (error.message) {
      const message = error.message?.match(/Error: (.*)/)?.[1] || error.message
      ElMessage.warning(message)
    }
    return false
  }

  loading.value = true

  const closeMessage = ElMessage.loading(
    window.t('device.control.file.push.loading'),
  ).close

  await allSettledWrapper(devices, (item) => {
    return fileManageProxyRef.value.handlePush(item, { files, silent: true })
  })

  closeMessage()

  ElMessage.success(window.t('common.success.batch'))

  loading.value = false
}
</script>

<style></style>

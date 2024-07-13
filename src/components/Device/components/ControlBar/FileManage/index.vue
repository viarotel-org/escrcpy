<template>
  <el-dropdown :hide-on-click="false">
    <div class="">
      <slot v-bind="{ loading }" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handlePush(device)">
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
import { selectAndSendFileToDevice } from '$/utils/device/index.js'
import { useDeviceStore } from '$/store'
import { allSettledWrapper } from '$/utils'

const props = defineProps({
  device: {
    type: Object,
    default: () => null,
  },
})

const deviceStore = useDeviceStore()

const loading = ref(false)

async function handlePush(device, { files } = {}) {
  if (!files) {
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
        const message
          = error.message?.match(/Error: (.*)/)?.[1] || error.message
        ElMessage.warning(message)
      }

      return false
    }
  }

  loading.value = true

  const closeMessage = ElMessage.loading(
    window.t('device.control.file.push.loading'),
    { grouping: true },
  ).close

  let failCount = 0

  await allSettledWrapper(files, (item) => {
    return window.adbkit.push(device.id, item).catch(() => {
      ++failCount
    })
  })

  loading.value = false

  const totalCount = files.length
  const successCount = totalCount - failCount

  if (successCount) {
    closeMessage()

    if (totalCount > 1) {
      ElMessage.success(
        window.t('device.control.file.push.success', {
          deviceName: deviceStore.getLabel(device),
          totalCount,
          successCount,
          failCount,
        }),
      )
    }
    else {
      ElMessage.success(
        window.t('device.control.file.push.success.single', {
          deviceName: deviceStore.getLabel(device),
        }),
      )
    }

    return false
  }

  closeMessage()
  ElMessage.warning(window.t('device.control.file.push.error'))
}

defineExpose({
  handlePush,
})
</script>

<style></style>

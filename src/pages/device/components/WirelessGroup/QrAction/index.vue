<template>
  <el-popover
    ref="popoverRef"
    placement="top"
    :width="200"
    trigger="click"
    popper-class="el-popover--scanner"
    @hide="onHide"
  >
    <template #reference>
      <el-button
        type="primary"
        :icon="loading ? '' : 'FullScreen'"
        :loading="loading"
        class="flex-none !border-none"
        @click="handleClick"
      >
        {{ loading ? loadingText : $t('device.wireless.connect.qr') }}
      </el-button>
    </template>

    <el-image :key="dataUrl" class="!w-full" fit="contain" :src="dataUrl"></el-image>
  </el-popover>
</template>

<script setup>
import { generateAdbPairingQR } from '$/utils/device/generateAdbPairingQR/index.js'

const props = defineProps({
  handleRefresh: {
    type: Function,
    default: () => false,
  },
})

const dataUrl = ref('')

const loading = ref(false)

const loadingText = ref('')

const popoverRef = ref()

function onStatus(type) {
  loadingText.value = window.t(`device.wireless.connect.qr.${type}`)
}

async function handleClick() {
  const data = await generateAdbPairingQR()
  dataUrl.value = data.dataUrl

  loading.value = true

  try {
    await window.adb.scannerConnect(data.password, {
      onStatus,
    })
  }
  catch (error) {
    console.warn(error.message)
  }

  await props.handleRefresh()

  popoverRef.value.hide()

  loading.value = false
}

function onHide() {
  loading.value = false
}
</script>

<style lang="postcss">
.dark .el-popover--scanner {
  &, .el-popper__arrow::before {
    @apply !bg-primary-500;
  }
}
</style>

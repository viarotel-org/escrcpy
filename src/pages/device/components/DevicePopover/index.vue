<template>
  <el-popover
    ref="popoverRef"
    placement="right"
    :width="500"
    trigger="hover"
    popper-class="!p-0 !overflow-hidden !rounded-xl"
    @before-enter="onBeforeEnter"
    @after-leave="onAfterLeave"
  >
    <template #reference>
      <el-link type="primary" :underline="false" icon="InfoFilled" class="mr-1"></el-link>
    </template>

    <div v-loading="loading" :element-loading-text="$t('common.loading')" :class="connectFlag ? 'h-60' : ''" class="flex items-stretch p-2 space-x-2">
      <div v-if="connectFlag" class="flex-none pb-1">
        <img :src="deviceInfo.screencap" class="!h-full !overflow-hidden !rounded-xl !shadow min-w-24 max-w-56 bg-gray-200 dark:bg-black object-contain cursor-pointer" alt="" @click="handlePreview" />
      </div>

      <div class="flex-1 w-0 overflow-auto">
        <el-descriptions border :column="1" class="el-descriptions--custom">
          <el-descriptions-item :label="$t('device.id')">
            {{ deviceInfo.id }}
          </el-descriptions-item>

          <template v-if="deviceInfo.battery">
            <el-descriptions-item :label="$t('device.battery')">
              {{ deviceInfo.battery.batteryPercentage ? `${deviceInfo.battery.batteryPercentage}%` : '-' }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('device.isCharging')">
              {{ deviceInfo.battery.isCharging ? $t('common.yes') : $t('common.no') }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('device.temperature')">
              {{ deviceInfo.battery.temperatureCelsius ? `${deviceInfo.battery.temperatureCelsius}℃` : '-' }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('device.powerSource')">
              {{ deviceInfo.battery.powerSource || '-' }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('device.voltage')">
              {{ deviceInfo.battery.voltageV ? `${deviceInfo.battery.voltageV}v` : '-' }}
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </div>
    </div>

    <el-image-viewer v-if="imageViewerProps.visible" :url-list="[deviceInfo.screencap]" @close="onViewerClose" />
  </el-popover>
</template>

<script setup>
import { getDictLabel } from '$/dicts/helper'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
})

const loading = ref(false)

const deviceInfo = ref({
  screencap: void 0,
  battery: void 0,
})

const connectFlag = computed(() => ['device'].includes(props.device.status))

const screencapTimer = ref()

const imageViewerProps = ref({
  visible: false,
})

function handlePreview() {
  imageViewerProps.value.visible = true
}

function onViewerClose() {
  imageViewerProps.value.visible = false
}

async function onBeforeEnter() {
  Object.assign(deviceInfo.value, { ...props.device })

  if (!connectFlag.value) {
    return false
  }

  if (!deviceInfo.value.screencap) {
    loading.value = true
  }

  screencapTimer.value = setInterval(() => {
    getScreencap()
    getBattery()
  }, 5 * 1000)

  await Promise.allSettled([getScreencap(), getBattery()])

  loading.value = false
}

async function getScreencap() {
  try {
    const screencap = await window.adb.screencap(props.device.id, { returnBase64: true })
    Object.assign(deviceInfo.value, { screencap: `data:image/png;base64,${screencap}` })
  }
  catch (error) {
    onError()
    console.warn(error?.message || error)
  }
}

async function getBattery() {
  try {
    const battery = await window.adb.battery(props.device.id)
    Object.assign(deviceInfo.value, { battery: battery.computed })
  }
  catch (error) {
    onError()
    console.warn(error?.message || error)
  }
}

function onAfterLeave() {
  clearInterval(screencapTimer.value)

  onViewerClose()

  loading.value = false
}

function onError() {
  clearInterval(screencapTimer.value)
  props.device.status = 'offline'
}

onBeforeUnmount(() => {
  onAfterLeave()
})
</script>

<style lang="postcss" scoped>
:deep() .el-descriptions--custom .el-descriptions__label {
  @apply !truncate !w-0;
}
</style>

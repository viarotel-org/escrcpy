<template>
  <slot v-bind="{ loading, trigger: handleClick }" />
</template>

<script setup>
import { removeDevices } from '$/utils/device/index.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const loading = ref(false)

const deviceStore = useDeviceStore()

async function handleClick(devices) {
  try {
    await ElMessageBox.confirm(
      window.t('device.remove.confirm'),
      window.t('common.tips'),
      {
        type: 'warning',
      },
    )
  }
  catch (error) {
    return false
  }

  loading.value = true

  await removeDevices(...devices)
  await deviceStore.getList()

  loading.value = false
}
</script>

<style></style>

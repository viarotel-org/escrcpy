<template>
  <EleTooltipButton
    type="primary"
    text
    :loading="loading"
    :icon="loading ? '' : 'Connection'"
    placement="top"
    :content="loading ? $t('common.connecting') : $t('device.wireless.connect.name')"
    @click="handleClick(device)"
  >
  </EleTooltipButton>
</template>

<script setup>
const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
  handleConnect: {
    type: Function,
    default: () => false,
  },
})

const loading = ref(false)

async function handleClick(device) {
  loading.value = true

  await props.handleConnect(device.id)

  loading.value = false
}
</script>

<style></style>

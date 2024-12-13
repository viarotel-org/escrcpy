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
  const [host, port] = device.id.split(':')

  if (!host || !port) {
    console.warn('Failed to obtain IP and port number')
    return false
  }

  loading.value = true

  await props.handleConnect({
    host,
    port,
  })

  loading.value = false
}
</script>

<style></style>

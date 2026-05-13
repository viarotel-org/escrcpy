<template>
  <el-button
    type="default"
    :loading="loading"
    :title="$t('device.wireless.connect.discover.tips')"
    class="flex-none"
    @click="handleClick"
  >
    <template v-if="!loading" #icon>
      <i class="i-bi-wifi"></i>
    </template>
    {{ loading ? loadingText : $t('device.wireless.connect.discover') }}
  </el-button>
</template>

<script setup>
const props = defineProps({
  handleRefresh: {
    type: Function,
    default: () => false,
  },
})

const loading = ref(false)
const loadingText = ref('')
const devices = ref([])

const discoverTextKey = 'device.wireless.connect.discover'

const statusTextMap = {
  'scanning': `${discoverTextKey}.scanning`,
  'found': `${discoverTextKey}.found`,
  'probing': `${discoverTextKey}.probing`,
  'unreachable': `${discoverTextKey}.unreachable`,
  'connecting': `${discoverTextKey}.connecting`,
  'connected': `${discoverTextKey}.connected`,
  'connect-error': `${discoverTextKey}.connect-error`,
  'not-found': `${discoverTextKey}.not-found`,
  'error': `${discoverTextKey}.error`,
}

const errorMessageMap = {
  NO_DEVICES: `${discoverTextKey}.error.no-devices`,
  NO_REACHABLE_DEVICES: `${discoverTextKey}.error.no-reachable-devices`,
  NO_CONNECTED_DEVICES: `${discoverTextKey}.error.no-connected-devices`,
  NO_UNCONNECTED_DEVICES: `${discoverTextKey}.error.no-unconnected-devices`,
}

function getText(key, options) {
  if (!key) {
    return window.t(discoverTextKey, options)
  }

  return window.t(`${discoverTextKey}.${key}`, options)
}

function formatDevice(device = {}) {
  const address = [device.address, device.port].filter(Boolean).join(':')

  if (!device.name) {
    return address
  }

  return `${device.name} (${address})`
}

function onStatus(type, data) {
  loadingText.value = window.t(statusTextMap[type] || discoverTextKey)

  if (type === 'found' && data) {
    console.info('wireless.discover.found', formatDevice(data), data.source)
  }
}

function onDevice(device) {
  devices.value.push(device)
}

function getResultMessage(result) {
  if (result?.errorCode) {
    const errorKey = errorMessageMap[result.errorCode]

    return (errorKey && window.t(errorKey))
      || result.error
      || getText('error.retry')
  }

  return getText('error.failed')
}

async function handleClick() {
  if (loading.value) {
    return
  }

  loading.value = true
  loadingText.value = getText('scanning')
  devices.value = []

  try {
    const result = await window.$preload.adb.discoverConnect({
      onStatus,
      onDevice,
    })

    if (result?.success) {
      const count = result.results?.filter(item => item.success).length || 0
      ElMessage.success(getText('success', { count }))
      await props.handleRefresh()
      return
    }

    ElMessage.warning(getResultMessage(result))
  }
  catch (error) {
    console.warn(error?.message || error)
    ElMessage.warning(getText('error.failed'))
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <el-button
    type="danger"
    text
    :loading
    :icon="loading ? '' : 'Delete'"
    :title="$t('common.remove')"
    @click="handleClick(device)"
  >
  </el-button>

  <ConfigMigrationDialog
    v-if="migrationLazy.visible"
    ref="configMigrationDialog"
  />
</template>

<script setup>
import { findTargetDevices, removeDevices, ScrcpyConfigMigrator } from '$/utils/device/index.js'
import { sleep } from '$/utils'
import ConfigMigrationDialog from './components/config-migration-dialog/index.vue'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
  handleRefresh: {
    type: Function,
    default: () => {},
  },
})

const deviceStore = useDeviceStore()

const migrationLazy = useLazy()

const loading = ref(false)
const configMigrationDialog = ref(null)

const migrator = new ScrcpyConfigMigrator()

function checkDeviceConfig(device) {
  const scrcpyConfig = migrator.getScrcpyConfig()
  const hasConfig = migrator.hasConfig(scrcpyConfig, device.id)

  if (!hasConfig) {
    return { hasConfig: false }
  }

  const targetDevices = findTargetDevices(device, deviceStore.list)
  return {
    hasConfig: true,
    hasTargetDevices: targetDevices.length > 0,
  }
}

async function handleConfigMigration(device) {
  loading.value = false

  await migrationLazy.mount()

  configMigrationDialog.value.open({
    device,
    onSuccess: () => {
      handleRemove(props.device)
    },
    onSkip: () => {
      handleRemove(props.device)
    },
    onClosed: () => {
      migrationLazy.unmount()
    },
  })
}

async function handleClick(device = props.device) {
  loading.value = true

  try {
    const configInfo = checkDeviceConfig(device)

    if (!configInfo.hasConfig) {
      await handleRemove(device)
      return
    }

    if (!configInfo.hasTargetDevices) {
      await handleRemove(device)
      return
    }

    handleConfigMigration(device)
  }
  catch (error) {
    console.error('Error checking device config:', error)
    await handleRemove(device)
  }
}

async function handleRemove(device) {
  await removeDevices(device)

  migrator.processedDeviceIds.add(device.id)
  migrator.cleanupProcessedConfigs()

  props.handleRefresh()
  await sleep()
  loading.value = false
}
</script>

<style></style>

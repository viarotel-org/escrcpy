<template>
  <ExTooltipButton
    type="danger"
    text
    :loading
    :icon="loading ? '' : 'Delete'"
    placement="top"
    :content="$t('common.remove')"
    @click="handleClick(device)"
  >
  </ExTooltipButton>

  <ConfigMigrationDialog
    ref="configMigrationDialog"
    @success="onMigrationSuccess"
    @skip="onMigrationSkip"
    @cancel="onMigrationCancel"
  />
</template>

<script setup>
import { findTargetDevices, removeDevices, ScrcpyConfigMigrator } from '$/utils/device/index.js'
import { sleep } from '$/utils'
import ConfigMigrationDialog from './components/config-migration-dialog/index.vue'

// Props
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

// Store
const deviceStore = useDeviceStore()

// Refs
const loading = ref(false)
const configMigrationDialog = ref(null)

const migrator = new ScrcpyConfigMigrator()

/**
 * Check device configuration
 */
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

/**
 * Handle configuration migration
 */
function handleConfigMigration(device) {
  loading.value = false
  configMigrationDialog.value.open(device)
}

/**
 * Handle delete button click
 */
async function handleClick(device = props.device) {
  loading.value = true

  try {
    const configInfo = checkDeviceConfig(device)

    // No configuration, remove directly
    if (!configInfo.hasConfig) {
      await handleRemove(device)
      return
    }

    // Has configuration but no target devices to migrate, remove directly
    if (!configInfo.hasTargetDevices) {
      await handleRemove(device)
      return
    }

    // Has config and target devices exist, show migration dialog
    handleConfigMigration(device)
  }
  catch (error) {
    console.error('Error checking device config:', error)
    // On error, remove device directly
    await handleRemove(device)
  }
}

/**
 * Remove device
 */
async function handleRemove(device) {
  await removeDevices(device)

  migrator.processedDeviceIds.add(device.id)
  migrator.cleanupProcessedConfigs()

  props.handleRefresh()
  await sleep()
  loading.value = false
}

/**
 * Configuration migration success callback
 */
async function onMigrationSuccess() {
  await handleRemove(props.device)
}

/**
 * Skip migration callback
 */
async function onMigrationSkip() {
  await handleRemove(props.device)
}

/**
 * Cancel migration callback
 */
function onMigrationCancel() {
  loading.value = false
}
</script>

<style></style>

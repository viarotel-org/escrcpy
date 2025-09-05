<template>
  <EleTooltipButton
    type="danger"
    text
    :loading
    :icon="loading ? '' : 'Delete'"
    placement="top"
    :content="$t('common.remove')"
    @click="handleClick(device)"
  >
  </EleTooltipButton>

  <ConfigMigrationDialog
    ref="configMigrationDialog"
    @success="onMigrationSuccess"
    @skip="onMigrationSkip"
    @cancel="onMigrationCancel"
  />
</template>

<script setup>
import { sleep } from '$/utils'
import { findTargetDevices, ScrcpyConfigMigrator } from '$/utils/device/index.js'
import ConfigMigrationDialog from './components/ConfigMigrationDialog/index.vue'

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
 * 检查设备配置信息
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
 * 处理配置迁移
 */
function handleConfigMigration(device) {
  loading.value = false
  configMigrationDialog.value.open(device)
}

/**
 * 处理点击删除按钮
 */
async function handleClick(device = props.device) {
  loading.value = true

  try {
    const configInfo = checkDeviceConfig(device)

    // 没有配置，直接删除
    if (!configInfo.hasConfig) {
      await removeDevice(device)
      return
    }

    // 有配置但没有可迁移的目标设备，直接删除
    if (!configInfo.hasTargetDevices) {
      await removeDevice(device)
      return
    }

    // 有配置且有可迁移的目标设备，显示迁移对话框
    handleConfigMigration(device)
  }
  catch (error) {
    console.error('Error checking device config:', error)
    // 出错时直接删除设备
    await removeDevice(device)
  }
}

/**
 * 删除设备
 */
async function removeDevice(device) {
  const devices = { ...window.appStore.get('device') }
  delete devices[device.id]
  window.appStore.set('device', devices)

  migrator.processedDeviceIds.add(device.id)
  migrator.cleanupProcessedConfigs()

  props.handleRefresh()
  await sleep()
  loading.value = false
}

/**
 * 配置迁移成功回调
 */
async function onMigrationSuccess() {
  await removeDevice(props.device)
}

/**
 * 跳过配置迁移回调
 */
async function onMigrationSkip() {
  await removeDevice(props.device)
}

/**
 * 取消配置迁移回调
 */
function onMigrationCancel() {
  loading.value = false
}
</script>

<style></style>

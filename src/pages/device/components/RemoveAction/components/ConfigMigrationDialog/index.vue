<template>
  <el-dialog
    v-model="visible"
    :title="$t('device.config.migration.title')"
    width="80%"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @closed="onClosed"
  >
    <div class="space-y-4">
      <!-- 提示信息 -->
      <el-alert
        :title="$t('device.config.migration.description.title')"
        type="primary"
        :description="$t('device.config.migration.description.content')"
        show-icon
        :closable="false"
      />

      <!-- 设备选择 -->
      <div class="space-y-3">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ $t('device.config.migration.select.title') }}
        </div>

        <div v-if="targetDevices.length === 0" class="text-center py-8 text-gray-500">
          {{ $t('device.config.migration.no.target.devices') }}
        </div>

        <el-checkbox-group v-else v-model="selectedDeviceIds" class="space-y-2">
          <div
            v-for="device of targetDevices"
            :key="device.id"
            class="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <el-checkbox :value="device.id" class="mr-3 w-full">
              <div class="flex flex-col space-y-1">
                <div class="font-medium">
                  {{ device.remark || device.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ device.id }}
                </div>
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="handleCancel">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button @click="handleSkip">
          {{ $t('device.config.migration.skip') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="selectedDeviceIds.length === 0"
          :loading="migrating"
          @click="handleMigrate"
        >
          {{ $t('device.config.migration.start') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { findTargetDevices, ScrcpyConfigMigrator } from '$/utils/device/index.js'

// Emits
const emit = defineEmits(['success', 'skip', 'cancel'])

// Store
const deviceStore = useDeviceStore()

// Reactive data
const visible = ref(false)
const migrating = ref(false)
const sourceDevice = ref(null)
const targetDevices = ref([])
const selectedDeviceIds = ref([])

/**
 * 打开对话框
 * @param {Object} device - 要删除的设备对象
 */
function open(device) {
  sourceDevice.value = device
  updateTargetDevices()
  visible.value = true
}

/**
 * 更新目标设备列表（通过 serialNo 匹配）
 */
function updateTargetDevices() {
  if (!sourceDevice.value?.serialNo) {
    targetDevices.value = []
    return
  }

  // 使用共享的工具函数查找目标设备
  targetDevices.value = findTargetDevices(sourceDevice.value, deviceStore.list)
}

/**
 * 处理取消操作
 */
function handleCancel() {
  visible.value = false
  emit('cancel')
}

/**
 * 处理跳过操作
 */
function handleSkip() {
  visible.value = false
  emit('skip')
}

/**
 * 处理配置迁移
 */
async function handleMigrate() {
  if (selectedDeviceIds.value.length === 0) {
    return
  }

  migrating.value = true

  try {
    const migrator = new ScrcpyConfigMigrator()
    let successCount = 0

    // 对每个选中的设备执行配置迁移
    for (const targetDeviceId of selectedDeviceIds.value) {
      const success = migrator.migrateConfigFromOldToNew(
        sourceDevice.value.id,
        targetDeviceId,
      )
      if (success) {
        successCount++
      }
    }

    if (successCount > 0) {
      ElMessage.success(
        window.t('device.config.migration.success', { count: successCount }),
      )
    }
    else {
      ElMessage.warning(window.t('device.config.migration.no.migration'))
    }

    visible.value = false
    emit('success', { successCount, totalCount: selectedDeviceIds.value.length })
  }
  catch (error) {
    console.error('Config migration failed:', error)
    ElMessage.error(window.t('device.config.migration.error'))
  }
  finally {
    migrating.value = false
  }
}

/**
 * 对话框关闭时的清理
 */
function onClosed() {
  sourceDevice.value = null
  targetDevices.value = []
  selectedDeviceIds.value = []
  migrating.value = false
}

// 暴露方法给父组件使用
defineExpose({
  open,
})
</script>

<style scoped>
:deep(.el-checkbox-group) {
  display: block;
}

:deep(.el-checkbox) {
  display: flex;
  align-items: flex-start;
  height: auto;
  margin-right: 0;
}

:deep(.el-checkbox__input) {
  margin-top: 2px;
}
</style>

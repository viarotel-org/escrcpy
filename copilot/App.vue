<template>
  <el-config-provider :locale="locale" :size="getSize($grid)">
    <div class="flex flex-col h-screen bg-white dark:bg-gray-900">
      <!-- 顶部标题栏 -->
      <div class="flex-none flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div class="flex items-center space-x-3">
          <el-icon :size="24" class="text-primary-500">
            <Cpu />
          </el-icon>
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t('copilot.title') }}
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ currentDevice?.id ? `${$t('copilot.device')}: ${getDeviceLabel(currentDevice)}` : $t('copilot.noDevice') }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <el-tooltip :content="$t('copilot.config.title')" placement="bottom">
            <el-button
              circle
              :icon="Setting"
              @click="showConfigDialog = true"
            />
          </el-tooltip>
          <el-tooltip :content="$t('copilot.promptManager.title')" placement="bottom">
            <el-button
              circle
              :icon="Collection"
              @click="showPromptManager = true"
            />
          </el-tooltip>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="flex-1 overflow-hidden">
        <ChatPanel
          v-if="currentDevice"
          :task-mode="taskMode"
          :target-devices="targetDevices"
          :current-device="currentDevice"
        />
        <div
          v-else
          class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
        >
          <div class="text-center">
            <el-icon :size="48" class="mb-4">
              <Monitor />
            </el-icon>
            <p>{{ $t('copilot.noDevice') }}</p>
            <p class="text-sm mt-2">
              {{ $t('copilot.noDeviceHint') }}
            </p>
          </div>
        </div>
      </div>

      <!-- 配置弹窗 -->
      <ConfigDialog v-model="showConfigDialog" />

      <!-- 快捷指令管理 -->
      <PromptManager v-model="showPromptManager" />
    </div>
  </el-config-provider>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Collection, Cpu, Monitor, Setting } from '@element-plus/icons-vue'
import { i18n } from '$/locales/index.js'
import localeModel from '$/plugins/element-plus/locale.js'

import ChatPanel from './components/ChatPanel/index.vue'
import ConfigDialog from './components/ConfigDialog/index.vue'
import PromptManager from './components/PromptManager/index.vue'

const locale = computed(() => {
  const i18nLocale = i18n.global.locale.value
  const value = localeModel[i18nLocale]
  return value
})

function getSize(grid) {
  const value = ['sm', 'md'].includes(grid.breakpoint) ? 'small' : 'default'
  return value
}

// 设备相关状态
const currentDevice = ref(null)
const taskMode = ref('single')
const targetDevices = ref([])

// 弹窗状态
const showConfigDialog = ref(false)
const showPromptManager = ref(false)

// 获取设备显示名称
const getDeviceLabel = (device) => {
  if (!device)
    return ''
  return device.remark || device.name || device.id
}

// 监听设备变化
const handleDeviceChange = (event, data) => {
  if (data) {
    currentDevice.value = data.device || data
    taskMode.value = data.mode || 'single'
    targetDevices.value = data.devices || [currentDevice.value]
  }
}

onMounted(() => {
  // 从 URL 参数获取设备信息
  const urlParams = new URLSearchParams(window.location.search)
  const deviceId = urlParams.get('id')
  const deviceName = urlParams.get('name')
  const deviceRemark = urlParams.get('remark')
  const mode = urlParams.get('mode')

  if (deviceId) {
    currentDevice.value = {
      id: deviceId,
      name: deviceName || deviceId,
      remark: deviceRemark || '',
    }
    taskMode.value = mode || 'single'
    targetDevices.value = [currentDevice.value]
  }

  // 监听设备变化事件
  window.electron.ipcRenderer.on('device-change', handleDeviceChange)

  // 检查配置是否完整
  const config = window.copilot?.getConfig?.() || {}
  if (!config.apiKey) {
    showConfigDialog.value = true
  }
})

onUnmounted(() => {
  window.electron.ipcRenderer.off('device-change', handleDeviceChange)
})
</script>

<style scoped>
/* 自定义样式 */
</style>

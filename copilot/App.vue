<template>
  <el-config-provider :locale="locale" :size="getSize($grid)">
    <div class="flex flex-col h-screen bg-white dark:bg-gray-900">
      <!-- 顶部标题栏 - 紧凑设计 -->
      <div class="copilot-header flex-none flex items-center justify-between px-3 h-12 border-b border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div class="flex items-center gap-2.5">
          <!-- Logo -->
          <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
            <el-icon :size="14" class="text-white">
              <Cpu />
            </el-icon>
          </div>

          <!-- 标题和设备信息 -->
          <div class="flex items-center gap-2">
            <h1 class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ $t('copilot.title') }}
            </h1>
            <div v-if="currentDevice?.id" class="device-badge flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span class="text-xs font-medium truncate max-w-[120px]">
                {{ getDeviceLabel(currentDevice) }}
              </span>
            </div>
            <div v-else class="device-badge flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span class="text-xs">{{ $t('copilot.noDevice') }}</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center gap-1">
          <el-tooltip :content="$t('copilot.promptManager.title')" placement="bottom">
            <el-button
              text
              size="small"
              class="!w-8 !h-8"
              @click="showPromptManager = true"
            >
              <el-icon :size="16">
                <Collection />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('copilot.config.title')" placement="bottom">
            <el-button
              text
              size="small"
              class="!w-8 !h-8"
              @click="showConfigDialog = true"
            >
              <el-icon :size="16">
                <Setting />
              </el-icon>
            </el-button>
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
          @show-prompt-manager="showPromptManager = true"
        />
        <div
          v-else
          class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
        >
          <div class="text-center px-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
              <el-icon :size="28" class="text-gray-400">
                <Monitor />
              </el-icon>
            </div>
            <p class="font-medium text-gray-700 dark:text-gray-300">
              {{ $t('copilot.noDevice') }}
            </p>
            <p class="text-sm mt-1 text-gray-400">
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
import { onMounted, onUnmounted, ref } from 'vue'
import { Collection, Cpu, Monitor, Setting } from '@element-plus/icons-vue'
import copilotClient from '$/services/copilot/index.js'

import ChatPanel from './components/ChatPanel/index.vue'
import ConfigDialog from './components/ConfigDialog/index.vue'
import PromptManager from './components/PromptManager/index.vue'

const { queryParams: currentDevice, locale, getSize } = useWindowStateSync()

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

onMounted(async () => {
  // 监听设备变化事件
  window.electron.ipcRenderer.on('device-change', handleDeviceChange)

  // 检查配置是否完整
  const config = await copilotClient.getConfig() || {}
  if (!config.apiKey) {
    showConfigDialog.value = true
  }
})

onUnmounted(() => {
  window.electron.ipcRenderer.off('device-change', handleDeviceChange)
})
</script>

<style>
</style>

<template>
  <el-config-provider :locale="locale" :size="getSize($grid)">
    <div
      class="flex flex-col h-screen"
    >
      <!-- Top title bar - compact design -->
      <div
        :class="[
          {
            'pl-24': isPlatform('macos'),
            'pr-42': isPlatform('windows'),
          },
        ]"
        class="app-region-drag flex-none flex items-center justify-between px-3 h-10"
      >
        <div class="flex items-center gap-4">
          <div class="text-sm font-semibold">
            Escrcpy Copilot
          </div>

          <el-tag v-if="currentDevice?.id" type="primary" class="">
            <div class="flex items-center gap-2">
              <div class="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              {{ getDeviceLabel(currentDevice) }}
            </div>
          </el-tag>
          <div v-else class="device-badge flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span class="text-xs">{{ $t('copilot.noDevice') }}</span>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-1 *:app-region-no-drag">
          <el-tooltip :content="$t('copilot.promptManager.title')" placement="bottom">
            <el-button
              text
              size="small"
              class="!w-8 !h-8"
              @click="onPromptManagerClick"
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
              @click="onConfigClick"
            >
              <el-icon :size="16">
                <Setting />
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <!-- Main content area -->
      <div class="flex-1 min-h-0 overflow-hidden">
        <ChatPanel
          v-if="currentDevice"
          :current-device="currentDevice"
          @show-prompt-manager="showPromptManager = true"
        />
      </div>

      <!-- Config dialog -->
      <ConfigDialog ref="configDialogRef" />

      <!-- Quick commands -->
      <PromptManager ref="promptManagerRef" />
    </div>
  </el-config-provider>
</template>

<script setup>
import ChatPanel from './components/chat/index.vue'
import ConfigDialog from './components/config/index.vue'
import { PromptManager } from './components/prompts/index.js'

import { isPlatform } from '$/utils/index.js'

const { queryParams: currentDevice, locale, getSize } = useWindowStateSync({
  onLanguageChange(val) {
    window.appStore.set('copilot', {
      ...window.appStore.get('copilot'),
      lang: ['zh-CN', 'zh-TW'].includes(val) ? 'cn' : 'en',
    })
  },
})

const configDialogRef = ref(null)
const promptManagerRef = ref(null)

// Get device display name
const getDeviceLabel = (device) => {
  if (!device)
    return ''
  return device.remark || device.name || device.id
}

function onConfigClick() {
  configDialogRef.value.open()
}

function onPromptManagerClick() {
  promptManagerRef.value.open()
}
</script>

<style>
</style>

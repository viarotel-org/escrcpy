<template>
  <el-config-provider :locale="locale" :size="size">
    <div
      class="flex flex-col h-screen"
    >
      <div
        :class="[
          {
            'pl-20': isPlatform('macos'),
            'pr-[calc(100px+3.6vw)]': isPlatform('windows') || isPlatform('linux'),
          },
        ]"
        class="app-region-drag flex-none flex items-center justify-between px-2 py-2"
      >
        <div class="flex items-center gap-4">
          <div class="text-sm font-semibold pl-2">
            Escrcpy Copilot
          </div>

          <el-tag v-if="currentDevice?.id" type="primary" class="">
            <div class="flex items-center gap-2">
              <div class="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              {{ deviceLabel }}
            </div>
          </el-tag>
          <div v-else class="device-badge flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span class="text-xs">{{ $t('copilot.noDevice') }}</span>
          </div>
        </div>

        <div class="flex items-center !space-x-2 *:app-region-no-drag">
          <el-button
            circle
            text
            icon="Collection"
            :title="$t('copilot.promptManager.title')"
            @click="onPromptManagerClick"
          >
          </el-button>

          <el-button
            circle
            text
            icon="Setting"
            :title="$t('copilot.config.title')"
            @click="onConfigClick"
          >
          </el-button>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-hidden">
        <ChatPanel
          v-if="currentDevice"
          :current-device="currentDevice"
          @no-api-key="onConfigClick"
        />
      </div>

      <ConfigDialog ref="configDialogRef" />

      <PromptManager ref="promptManagerRef" />
    </div>
    <WindowControls v-if="isPlatform('windows') || isPlatform('linux')" />
  </el-config-provider>
</template>

<script setup>
import WindowControls from '$/components/window-controls/index.vue'
import ChatPanel from './components/chat/index.vue'
import ConfigDialog from './components/config/index.vue'
import { PromptManager } from './components/prompts/index.js'

import { isPlatform } from '$/utils/index.js'

const copilotStore = useCopilotStore()
const deviceStore = useDeviceStore()

const { currentDevice, locale, size } = useWindowStateSync({
  onLanguageChange(val) {
    copilotStore.updateConfig({
      lang: ['zh-CN', 'zh-TW'].includes(val) ? 'cn' : 'en',
    })
  },
})

const configDialogRef = ref(null)
const promptManagerRef = ref(null)

const deviceLabel = computed(() => {
  return deviceStore.getLabel(currentDevice.value, 'name')
})

function onConfigClick() {
  configDialogRef.value.open()
}

function onPromptManagerClick() {
  promptManagerRef.value.open()
}
</script>

<style>
</style>

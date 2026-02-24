<template>
  <el-config-provider :locale="locale" :size="size">
    <div
      class="flex flex-col h-screen"
    >
      <AppHeader
        title="Escrcpy Copilot"
        :device-name="deviceLabel"
        class="px-2 pb-2"
      >
        <template #right>
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
        </template>
      </AppHeader>

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
  </el-config-provider>
</template>

<script setup>
import AppHeader from '$/components/app-header/index.vue'
import ChatPanel from './components/chat/index.vue'
import ConfigDialog from './components/config/index.vue'
import { PromptManager } from './components/prompts/index.js'

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

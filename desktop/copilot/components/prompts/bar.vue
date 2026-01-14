<template>
  <div v-if="showPromptManager || quickPrompts.length" class="flex items-center !space-x-2 pl-2 pt-2">
    <div class="flex-none text-sm text-gray-400">
      {{ $t('copilot.quickPrompts') }}
    </div>

    <Scrollable class="flex-1 min-w-0">
      <div class="flex items-center !space-x-2">
        <el-button
          v-for="(prompt, index) in quickPrompts"
          :key="index"
          class="flex-none !text-xs !xl:text-sm"
          round
          @click="onPromptClick(prompt)"
        >
          {{ prompt }}
        </el-button>
      </div>
    </Scrollable>

    <div v-if="showPromptManager" class="flex-none">
      <el-button
        text
        size="small"
        class="!w-8 !h-8"
        @click="onManagerClick"
      >
        <el-icon :size="16">
          <Collection />
        </el-icon>
      </el-button>
    </div>

    <!-- Quick prompts -->
    <PromptManager v-if="showPromptManager" ref="promptManagerRef" />
  </div>
</template>

<script setup>
import { PromptManager } from '$copilot/components/prompts/index.js'

const props = defineProps({
  showPromptManager: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-prompt'])

const copilotStore = useCopilotStore()

const quickPrompts = computed(() => {
  return copilotStore.config?.prompts || []
})

const promptManagerRef = ref(null)

function onPromptClick(prompt) {
  emit('select-prompt', prompt)
}

function onManagerClick() {
  promptManagerRef.value.open()
}
</script>

<style>
</style>

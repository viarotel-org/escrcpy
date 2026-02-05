<template>
  <div class="space-y-2">
    <PromptBar v-bind="{ showPromptManager }" @select-prompt="onSelectPrompt" />

    <TChatSender
      ref="senderRef"
      v-model="localValue"
      class="!pt-2"
      :loading="isExecuting"
      :textarea-props="{
        placeholder: resolvedPlaceholder,
        autosize: { minRows: 1, maxRows: 6 },
      }"
      @send="handleSend"
      @stop="handleStop"
    >
      <template #suffix="{ renderPresets }">
        <component :is="renderPresets([])" />
      </template>
    </TChatSender>
  </div>
</template>

<script setup>
import {
  ChatSender as TChatSender,
} from '@tdesign-vue-next/chat'
import '$/plugins/tdesign-next-chat/styles/theme.css'
import { PromptBar } from '$copilot/components/prompts/index.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  isExecuting: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  showPromptManager: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'stop'])

const senderRef = ref(null)

const localValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const resolvedPlaceholder = computed(() => {
  return props.placeholder || t('copilot.inputPlaceholder')
})

function onSelectPrompt(prompt) {
  emit('update:modelValue', prompt)
}

function handleSend(value) {
  const text = (value ?? localValue.value).trim()
  if (!text || props.isExecuting)
    return
  emit('submit', text)
}

function handleStop() {
  emit('stop')
}

function focus() {
  nextTick(() => {
    const textarea = senderRef.value?.$el?.querySelector?.('textarea')
    textarea?.focus?.()
  })
}

defineExpose({
  focus,
})
</script>

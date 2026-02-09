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
      <template v-if="!isKeyboardInstalled" #prefix>
        <el-button
          type="warning"
          plain
          round
          icon="Download"
          :title="$t('copilot.check.adb.notInstalled')"
          @click="onInstallKeyboard"
        >
          AdbKeyboard
        </el-button>
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
import pLimit from 'p-limit'
import { deviceSelectionHelper } from '$/utils/device/selection/index.js'

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
  currentDevices: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'stop'])

const senderRef = ref(null)

const isKeyboardInstalled = ref(true)

const localValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const resolvedPlaceholder = computed(() => {
  return props.placeholder || t('copilot.inputPlaceholder')
})

const selectedDevices = computed(() => {
  return deviceSelectionHelper.filter(props.currentDevices, 'onlineAndUnique')
})

onMounted(() => {
  handleCheckKeyboard()
})

async function handleCheckKeyboard() {
  if (!selectedDevices.value.length) {
    return false
  }

  const concurrencyLimit = Number(window.$preload.store.get('common.concurrencyLimit') ?? 5)
  const limit = pLimit(concurrencyLimit)

  try {
    const tasks = selectedDevices.value.map(device =>
      limit(() => window.$preload.adb.isInstalledAdbKeyboard(device.id)),
    )

    const results = await Promise.all(tasks)

    const allInstalled = results.every(installed => installed)

    isKeyboardInstalled.value = allInstalled

    return allInstalled
  }
  catch (error) {
    console.error(error.message)
    isKeyboardInstalled.value = false
    return false
  }
}

async function onInstallKeyboard() {
  const concurrencyLimit = Number(window.$preload.store.get('common.concurrencyLimit') ?? 5)
  const limit = pLimit(concurrencyLimit)

  const tasks = selectedDevices.value.map(device =>
    limit(() => window.$preload.adb.installAdbKeyboard(device.id)),
  )

  const results = await Promise.all(tasks)

  isKeyboardInstalled.value = results.every(res => res === true)
}

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

<template>
  <el-dialog
    v-model="visible"
    width="680px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    destroy-on-close
    append-to-body
    class="el-dialog--headless el-dialog--chat-input"
    @closed="handleClosed"
  >
    <!-- Close button -->
    <div class="absolute -bottom-4 left-1/2 translate-y-full -translate-x-1/2 flex items-center gap-2 z-50">
      <el-icon
        class="cursor-pointer w-8 h-8 flex items-center justify-center bg-white/30 hover:bg-gray-100 dark:bg-gray-800/80 dark:hover:bg-gray-700 rounded-full transition-all backdrop-blur-sm shadow-sm"
        @click="close"
      >
        <ElIconCloseBold />
      </el-icon>
    </div>

    <ChatInput
      ref="chatInputRef"
      v-model="inputValue"
      class="px-2 pb-2"
      :is-executing="isExecuting"
      :placeholder="$t('copilot.inputPlaceholder')"
      show-prompt-manager
      @submit="handleSubmit"
      @stop="handleStop"
    />
  </el-dialog>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import ChatInput from '$copilot/components/chat/modules/input.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  devices: {
    type: Array,
    default: () => [],
  },
  isExecuting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'closed', 'stop'])

// Input content
const inputValue = ref('')
const chatInputRef = ref(null)

// Two-way bound visibility state
const visible = ref(false)

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// Open dialog
function open() {
  visible.value = true

  nextTick(() => {
    chatInputRef.value?.focus()
  })
}

// Submit
function handleSubmit() {
  if (!inputValue.value.trim() || props.isExecuting)
    return

  emit('submit', inputValue.value.trim())
}

// Stop handler
function handleStop() {
  emit('stop')
}

// Close
function close() {
  visible.value = false
}

// After close callback
function handleClosed() {
  inputValue.value = ''
  emit('closed')
}

defineExpose({
  open,
  close,
})
</script>

<style lang="postcss">
.el-dialog--chat-input {
  @apply !p-0 !rounded-xl;

  .el-dialog__body {
    @apply !rounded-xl !overflow-hidden;
  }
}
</style>

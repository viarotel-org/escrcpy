<template>
  <el-dialog
    v-model="dialog.visible"
    width="680px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    destroy-on-close
    append-to-body
    class="el-dialog--headless el-dialog--chat-input"
    @closed="onClosed"
  >
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
      :current-devices="devices"
      show-prompt-manager
      @submit="handleSubmit"
      @stop="handleStop"
    />
  </el-dialog>
</template>

<script setup>
import ChatInput from '$copilot/components/chat/modules/input.vue'

const props = defineProps({
  isExecuting: {
    type: Boolean,
    default: false,
  },
})

const inputValue = ref('')
const chatInputRef = ref(null)
const devices = ref([])

const dialog = useDialog()

function open(options) {
  devices.value = options.devices || []
  dialog.open(options)

  nextTick(() => {
    chatInputRef.value?.focus()
  })
}

function handleSubmit() {
  if (!inputValue.value.trim() || props.isExecuting)
    return

  dialog.options.onSubmit?.(inputValue.value.trim())
}

function handleStop() {
  dialog.options.onStop?.()
}

function close() {
  dialog.close()
}

function onClosed() {
  devices.value = []
  inputValue.value = ''
  dialog.options.onClosed?.()
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

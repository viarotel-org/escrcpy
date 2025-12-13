<template>
  <div class="chat-input flex-none border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <!-- 快捷指令栏 -->
    <div
      v-if="showQuickPrompts && quickPrompts.length > 0"
      class="quick-prompts-bar px-4 py-2 border-b border-gray-100 dark:border-gray-800"
    >
      <div class="flex items-center gap-2 overflow-x-auto scrollbar-thin">
        <span class="text-xs text-gray-400 flex-none">
          {{ $t('copilot.quickPrompts') }}
        </span>
        <button
          v-for="(prompt, index) in quickPrompts.slice(0, 5)"
          :key="index"
          class="prompt-tag flex-none px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          @click="handlePromptClick(prompt)"
        >
          {{ prompt }}
        </button>
        <el-button
          v-if="quickPrompts.length > 5"
          size="small"
          text
          type="primary"
          class="flex-none !px-2"
          @click="emit('showPromptManager')"
        >
          {{ $t('copilot.morePrompts') }}
        </el-button>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area p-4">
      <div class="input-container flex items-end gap-3">
        <!-- 文本输入框 -->
        <div class="flex-1 relative">
          <el-input
            ref="inputRef"
            v-model="inputValue"
            type="textarea"
            :placeholder="$t('copilot.inputPlaceholder')"
            :autosize="{ minRows: 1, maxRows: 6 }"
            :disabled="isExecuting"
            resize="none"
            class="chat-textarea"
            @keydown.enter.exact.prevent="handleSubmit"
            @keydown.enter.shift.exact="() => {}"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="flex-none flex items-center gap-2">
          <el-tooltip v-if="!isExecuting" :content="$t('copilot.send')" placement="top">
            <el-button
              type="primary"
              :icon="Promotion"
              :disabled="!inputValue.trim()"
              circle
              class="send-button"
              @click="handleSubmit"
            />
          </el-tooltip>

          <el-tooltip v-else :content="$t('copilot.stop')" placement="top">
            <el-button
              type="danger"
              circle
              class="stop-button"
              @click="handleStop"
            >
              <div class="stop-icon"></div>
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="mt-2 flex items-center justify-between text-xs text-gray-400">
        <span>
          <kbd class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">Enter</kbd>
          {{ $t('copilot.sendHint') }}
        </span>
        <span v-if="inputValue.length > 0" class="text-gray-400">
          {{ inputValue.length }} {{ $t('copilot.characters') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { Promotion } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  isExecuting: {
    type: Boolean,
    default: false,
  },
  quickPrompts: {
    type: Array,
    default: () => [],
  },
  showQuickPrompts: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'stop', 'showPromptManager'])

const inputRef = ref(null)

// 双向绑定
const inputValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  inputValue.value = val
})

watch(inputValue, (val) => {
  emit('update:modelValue', val)
})

// 处理快捷指令点击
function handlePromptClick(prompt) {
  inputValue.value = prompt
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 提交
function handleSubmit() {
  if (!inputValue.value.trim() || props.isExecuting)
    return
  emit('submit', inputValue.value)
}

// 停止
function handleStop() {
  emit('stop')
}

// 聚焦输入框
function focus() {
  inputRef.value?.focus()
}

// 暴露方法
defineExpose({
  focus,
})
</script>

<style scoped>
.quick-prompts-bar::-webkit-scrollbar {
  height: 4px;
}

.quick-prompts-bar::-webkit-scrollbar-track {
  background: transparent;
}

.quick-prompts-bar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

.scrollbar-thin {
  scrollbar-width: thin;
}

.chat-textarea :deep(.el-textarea__inner) {
  border-radius: 16px;
  padding: 12px 16px;
  background: #f5f5f5;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.dark .chat-textarea :deep(.el-textarea__inner) {
  background: rgba(55, 65, 81, 0.5);
}

.chat-textarea :deep(.el-textarea__inner:focus) {
  background: #fff;
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 3px rgba(var(--el-color-primary-rgb), 0.1);
}

.dark .chat-textarea :deep(.el-textarea__inner:focus) {
  background: rgba(55, 65, 81, 0.8);
}

.send-button {
  width: 44px;
  height: 44px;
  font-size: 18px;
  transition: all 0.2s ease;
}

.send-button:not(:disabled):hover {
  transform: scale(1.05);
}

.stop-button {
  width: 44px;
  height: 44px;
}

.stop-icon {
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 2px;
}

kbd {
  font-family: inherit;
  font-size: 10px;
}
</style>

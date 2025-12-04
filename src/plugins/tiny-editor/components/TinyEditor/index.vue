<template>
  <div class="tiny-editor-wrapper" :class="{ 'is-dark': isDark }">
    <div ref="editorRef" class="tiny-editor-container"></div>
  </div>
</template>

<script setup>
import FluentEditor from '@opentiny/fluent-editor'
import '@opentiny/fluent-editor/style.css'

defineOptions({
  name: 'TinyEditor',
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  height: {
    type: [String, Number],
    default: '400px',
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'ready'])

const editorRef = ref(null)
const editorInstance = ref(null)
const isInternalChange = ref(false)

// 检测暗色模式
const isDark = computed(() => {
  return document.documentElement.classList.contains('dark')
})

// 计算高度样式
const heightStyle = computed(() => {
  if (typeof props.height === 'number') {
    return `${props.height}px`
  }
  return props.height
})

// 初始化编辑器
function initEditor() {
  if (!editorRef.value || editorInstance.value) {
    return
  }

  try {
    editorInstance.value = new FluentEditor(editorRef.value, {
      theme: 'snow',
      placeholder: props.placeholder,
      readOnly: props.readonly,
      modules: {
        toolbar: props.readonly
          ? false
          : [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              ['clean'],
            ],
      },
    })

    // 设置初始内容
    if (props.modelValue) {
      editorInstance.value.setText(props.modelValue)
    }

    // 监听内容变化
    editorInstance.value.on('text-change', () => {
      if (isInternalChange.value) {
        return
      }
      const text = editorInstance.value.getText()
      // 移除末尾的换行符
      const trimmedText = text.replace(/\n$/, '')
      emit('update:modelValue', trimmedText)
      emit('change', trimmedText)
    })

    emit('ready', editorInstance.value)
  }
  catch (error) {
    console.error('Failed to initialize FluentEditor:', error)
  }
}

// 销毁编辑器
function destroyEditor() {
  if (editorInstance.value) {
    try {
      // FluentEditor 可能没有 destroy 方法，直接置空
      editorInstance.value = null
    }
    catch (error) {
      console.error('Failed to destroy FluentEditor:', error)
    }
  }
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorInstance.value) {
      const currentText = editorInstance.value.getText().replace(/\n$/, '')
      if (currentText !== newValue) {
        isInternalChange.value = true
        editorInstance.value.setText(newValue || '')
        isInternalChange.value = false
      }
    }
  },
)

// 监听 readonly 变化
watch(
  () => props.readonly,
  (newValue) => {
    if (editorInstance.value) {
      editorInstance.value.enable(!newValue)
    }
  },
)

onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  destroyEditor()
})

// 暴露方法
defineExpose({
  getEditor: () => editorInstance.value,
  getText: () => editorInstance.value?.getText()?.replace(/\n$/, '') || '',
  setText: text => editorInstance.value?.setText(text),
  focus: () => editorInstance.value?.focus(),
})
</script>

<style scoped>
.tiny-editor-wrapper {
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
}

.tiny-editor-container {
  height: v-bind(heightStyle);
  overflow-y: auto;
}

/* 暗色模式样式 */
.tiny-editor-wrapper.is-dark :deep(.ql-toolbar) {
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color);
}

.tiny-editor-wrapper.is-dark :deep(.ql-container) {
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color);
  color: var(--el-text-color-primary);
}

.tiny-editor-wrapper.is-dark :deep(.ql-editor.ql-blank::before) {
  color: var(--el-text-color-placeholder);
}

.tiny-editor-wrapper.is-dark :deep(.ql-stroke) {
  stroke: var(--el-text-color-primary);
}

.tiny-editor-wrapper.is-dark :deep(.ql-fill) {
  fill: var(--el-text-color-primary);
}

/* 编辑器内容区域样式 */
.tiny-editor-wrapper :deep(.ql-editor) {
  min-height: 200px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

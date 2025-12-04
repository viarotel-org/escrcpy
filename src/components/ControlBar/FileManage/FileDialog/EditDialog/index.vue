<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="80%"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    class="el-dialog--beautify"
  >
    <div v-loading="loading" class="space-y-4">
      <!-- 文件名输入 -->
      <div>
        <label class="block text-sm font-medium mb-1">
          {{ $t('device.control.file.manager.edit.filename') }}
        </label>
        <el-input
          v-model="filename"
          :placeholder="$t('common.input.placeholder')"
          :disabled="loading"
        />
      </div>

      <!-- 文件内容编辑器（仅文本文件显示） -->
      <div v-if="isTextFile && mode === 'edit'">
        <label class="block text-sm font-medium mb-1">
          {{ $t('device.control.file.manager.edit.content') }}
        </label>
        <TinyEditor
          v-model="content"
          :height="400"
          :placeholder="$t('common.input.placeholder')"
          :readonly="loading"
        />
      </div>
    </div>

    <template #footer>
      <el-button @click="handleCancel">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">
        {{ $t('device.control.file.manager.edit.save') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  fileManager: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['success'])

// 允许编辑的文本文件扩展名
const TEXT_FILE_EXTENSIONS = ['.txt', '.md', '.log', '.json']

// 最大可编辑文件大小 (1MB)
const MAX_EDITABLE_SIZE = 1024 * 1024

// 对话框状态
const visible = ref(false)
const loading = ref(false)
const saving = ref(false)

// 编辑数据
const mode = ref('rename') // 'rename' | 'edit'
const filename = ref('')
const content = ref('')
const originalItem = ref(null)

// 计算属性
const isTextFile = computed(() => {
  if (!originalItem.value || originalItem.value.type === 'directory') {
    return false
  }
  const ext = getFileExtension(originalItem.value.name)
  return TEXT_FILE_EXTENSIONS.includes(ext)
})

const dialogTitle = computed(() => {
  if (mode.value === 'edit') {
    return window.t('device.control.file.manager.edit.title')
  }
  return window.t('device.control.file.manager.rename')
})

/**
 * 获取文件扩展名
 */
function getFileExtension(name) {
  const lastDotIndex = name.lastIndexOf('.')
  if (lastDotIndex === -1)
    return ''
  return name.substring(lastDotIndex).toLowerCase()
}

/**
 * 打开对话框 - 重命名模式
 */
async function openRename(item) {
  originalItem.value = item
  mode.value = 'rename'
  filename.value = item.name
  content.value = ''
  visible.value = true
}

/**
 * 打开对话框 - 编辑模式
 */
async function openEdit(item) {
  originalItem.value = item
  mode.value = 'edit'
  filename.value = item.name
  content.value = ''
  visible.value = true
  loading.value = true

  try {
    // 读取文件内容
    const result = await props.fileManager.operations.readFile(item.id, { maxSize: MAX_EDITABLE_SIZE })

    if (!result.success) {
      if (result.error === 'FILE_TOO_LARGE') {
        const maxSizeStr = `${Math.round(MAX_EDITABLE_SIZE / 1024 / 1024)}MB`
        ElMessage.error(window.t('device.control.file.manager.edit.file.too.large', { maxSize: maxSizeStr }))
      }
      else {
        ElMessage.error(window.t('device.control.file.manager.edit.read.error', { error: result.error }))
      }
      visible.value = false
      return
    }

    content.value = result.data.content
  }
  catch (error) {
    console.error('Failed to read file:', error)
    ElMessage.error(window.t('device.control.file.manager.edit.read.error', { error: error.message }))
    visible.value = false
  }
  finally {
    loading.value = false
  }
}

/**
 * 取消
 */
function handleCancel() {
  visible.value = false
}

/**
 * 保存
 */
async function handleSave() {
  const newFilename = filename.value.trim()

  if (!newFilename) {
    ElMessage.warning(window.t('common.input.placeholder'))
    return
  }

  if (newFilename.includes('/')) {
    ElMessage.error(window.t('device.control.file.manager.rename.invalid'))
    return
  }

  saving.value = true

  try {
    const originalDir = originalItem.value.id.substring(0, originalItem.value.id.lastIndexOf('/'))
    const originalFilename = originalItem.value.name
    const newPath = `${originalDir}/${newFilename}`.replace(/\/+/g, '/')

    // 如果文件名改变了，先重命名
    if (newFilename !== originalFilename) {
      const renameResult = await props.fileManager.operations.rename(
        originalItem.value,
        newFilename,
        { autoRefresh: false },
      )

      if (!renameResult.success) {
        ElMessage.error(window.t('device.control.file.manager.rename.error', { error: renameResult.error }))
        return
      }
    }

    // 如果是编辑模式，写入文件内容
    if (mode.value === 'edit' && isTextFile.value) {
      const writeResult = await props.fileManager.operations.writeFile(newPath, content.value, { autoRefresh: true })

      if (!writeResult.success) {
        ElMessage.error(window.t('device.control.file.manager.edit.save.error', { error: writeResult.error }))
        return
      }
    }
    else {
      // 仅重命名，需要手动刷新
      await props.fileManager.refresh()
    }

    ElMessage.success(
      mode.value === 'edit'
        ? window.t('device.control.file.manager.edit.save.success')
        : window.t('device.control.file.manager.rename.success'),
    )

    visible.value = false
    emit('success')
  }
  catch (error) {
    console.error('Save failed:', error)
    ElMessage.error(window.t('device.control.file.manager.edit.save.error', { error: error.message }))
  }
  finally {
    saving.value = false
  }
}

defineExpose({
  openRename,
  openEdit,
})
</script>

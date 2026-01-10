<template>
  <el-dialog
    v-model="visible"
    :title="isTextFile ? $t('device.control.file.manager.edit.title') : $t('device.control.file.manager.rename')"
    width="80%"
    center
    append-to-body
    destroy-on-close
    :fullscreen="isTextFile"
    :close-on-click-modal="false"
    :class="isTextFile ? 'el-dialog--flex el-dialog--fullscreen' : ''"
    class="el-dialog--beautify "
  >
    <div v-loading="loading" class="space-y-4 h-full overflow-auto pr-4">
      <!-- Filename input -->
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

      <!-- File content editor (text files only) -->
      <div v-if="isTextFile">
        <label class="block text-sm font-medium mb-1">
          {{ $t('device.control.file.manager.edit.content') }}
        </label>

        <el-input v-model="content" type="textarea" :autosize="{ minRows: 10 }" :placeholder="$t('common.input.placeholder')"></el-input>
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
import { TEXT_FILE_EXTENSIONS } from '$/dicts/index.js'

const props = defineProps({
  explorer: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['success'])

// Maximum editable file size (1MB)
const MAX_EDITABLE_SIZE = 1024 * 1024

// 对话框状态
const visible = ref(false)
const loading = ref(false)
const saving = ref(false)

// 编辑数据
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
 * 打开对话框
 */
async function open(item) {
  originalItem.value = item
  filename.value = item.name
  content.value = ''
  visible.value = true

  if (!isTextFile.value) {
    return false
  }

  loading.value = true

  try {
    // 读取文件内容
    const result = await props.explorer.operations.readFile(item.id, { maxSize: MAX_EDITABLE_SIZE })

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
      const renameResult = await props.explorer.operations.rename(
        originalItem.value,
        newFilename,
        { autoRefresh: false },
      )

      if (!renameResult.success) {
        ElMessage.error(window.t('device.control.file.manager.rename.error', { error: renameResult.error }))
        return
      }
    }

    // 如果是文本文件，写入文件内容
    if (isTextFile.value) {
      const writeResult = await props.explorer.operations.writeFile(newPath, content.value, { autoRefresh: true })

      if (!writeResult.success) {
        ElMessage.error(window.t('device.control.file.manager.edit.save.error', { error: writeResult.error }))
        return
      }
    }

    await props.explorer.refresh()

    ElMessage.success(window.t('device.control.file.manager.edit.save.success'))

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
  open,
})
</script>

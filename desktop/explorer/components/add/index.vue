<template>
  <el-popover
    ref="popoverRef"
    placement="bottom-start"
    :width="350"
    trigger="click"
    @hide="onHide"
  >
    <template #reference>
      <slot name="reference"></slot>
    </template>
    <div class="space-y-2">
      <el-input
        v-model="inputName"
        :placeholder="$t('common.input.placeholder')"
        clearable
        class="w-full"
        @keyup.enter="handleConfirm"
      ></el-input>

      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ $t('device.control.file.manager.add.tips') }}
      </div>

      <div class="flex justify-end">
        <el-button type="primary" @click="handleConfirm">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { t } from '$/locales/index.js'
import { TEXT_FILE_EXTENSIONS } from '$/dicts/index.js'

const emit = defineEmits(['success'])

// Whitelisted text file extensions allowed for creation
const ALLOWED_TEXT_EXTENSIONS = TEXT_FILE_EXTENSIONS

const defaultText = 'NewItem'

const inputName = ref(defaultText)

const popoverRef = ref()

/**
 * Check whether a name is a file (contains extension)
 * @param {string} name - Name
 * @returns {boolean}
 */
function isFile(name) {
  return name.includes('.') && !name.startsWith('.') && !name.endsWith('.')
}

/**
 * Get file extension
 * @param {string} name - File name
 * @returns {string}
 */
function getExtension(name) {
  const lastDotIndex = name.lastIndexOf('.')
  if (lastDotIndex === -1)
    return ''
  return name.substring(lastDotIndex).toLowerCase()
}

/**
 * Check whether extension is whitelisted
 * @param {string} extension - Extension
 * @returns {boolean}
 */
function isAllowedExtension(extension) {
  return ALLOWED_TEXT_EXTENSIONS.includes(extension.toLowerCase())
}

function onHide() {
  inputName.value = defaultText
}

function handleConfirm() {
  const name = inputName.value.trim()

  if (!name) {
    ElMessage.warning(t('common.input.placeholder'))
    return
  }

  // Check whether the name contains illegal characters
  if (name.includes('/')) {
    ElMessage.error(t('device.control.file.manager.rename.invalid'))
    return
  }

  // Determine whether it's a file or a directory
  const isFileType = isFile(name)

  emit('success', {
    name,
    type: isFileType ? 'file' : 'directory',
  })

  popoverRef.value.hide()
}
</script>

<style></style>

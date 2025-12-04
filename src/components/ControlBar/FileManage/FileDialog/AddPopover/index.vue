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
        {{ $t('device.control.file.manager.add.file.type.error') }}
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
import { ElMessage } from 'element-plus'
import { t } from '$/locales/index.js'

const emit = defineEmits(['success'])

// 允许创建的文本文件扩展名白名单
const ALLOWED_TEXT_EXTENSIONS = ['.txt', '.md', '.log', '.json']

const defaultText = 'NewItem'

const inputName = ref(defaultText)

const popoverRef = ref()

/**
 * 检查是否为文件（包含扩展名）
 * @param {string} name - 名称
 * @returns {boolean}
 */
function isFile(name) {
  return name.includes('.') && !name.startsWith('.') && !name.endsWith('.')
}

/**
 * 获取文件扩展名
 * @param {string} name - 文件名
 * @returns {string}
 */
function getExtension(name) {
  const lastDotIndex = name.lastIndexOf('.')
  if (lastDotIndex === -1)
    return ''
  return name.substring(lastDotIndex).toLowerCase()
}

/**
 * 检查扩展名是否在白名单内
 * @param {string} extension - 扩展名
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

  // 检查名称是否包含非法字符
  if (name.includes('/')) {
    ElMessage.error(t('device.control.file.manager.rename.invalid'))
    return
  }

  // 判断是文件还是目录
  const isFileType = isFile(name)

  if (isFileType) {
    // 检查扩展名是否在白名单内
    const extension = getExtension(name)
    if (!isAllowedExtension(extension)) {
      ElMessage.error(t('device.control.file.manager.add.file.type.error'))
      return
    }
  }

  emit('success', {
    name,
    type: isFileType ? 'file' : 'directory',
  })

  popoverRef.value.hide()
}
</script>

<style></style>

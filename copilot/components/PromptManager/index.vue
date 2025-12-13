<template>
  <el-dialog
    v-model="visible"
    :title="$t('copilot.promptManager.title')"
    width="600px"
    :close-on-click-modal="false"
    @open="loadPrompts"
  >
    <div class="space-y-4">
      <!-- 添加新指令 -->
      <div class="flex space-x-2">
        <el-input
          v-model="newPrompt"
          :placeholder="$t('copilot.promptManager.inputPlaceholder')"
          clearable
          class="flex-1"
          @keydown.enter.prevent="addPrompt"
        >
          <template #prefix>
            <el-icon><EditPen /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" :icon="Plus" @click="addPrompt">
          {{ $t('copilot.promptManager.add') }}
        </el-button>
      </div>

      <!-- 指令列表 -->
      <div
        v-if="prompts.length > 0"
        class="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700"
      >
        <TransitionGroup name="list">
          <div
            v-for="(prompt, index) in prompts"
            :key="prompt + index"
            class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <!-- 编辑模式 -->
            <template v-if="editingIndex === index">
              <el-input
                v-model="editingValue"
                size="small"
                class="flex-1 mr-2"
                @keydown.enter.prevent="saveEdit(index)"
                @keydown.escape="cancelEdit"
              />
              <div class="flex-none space-x-1">
                <el-button size="small" type="primary" @click="saveEdit(index)">
                  {{ $t('common.save') }}
                </el-button>
                <el-button size="small" @click="cancelEdit">
                  {{ $t('common.cancel') }}
                </el-button>
              </div>
            </template>

            <!-- 显示模式 -->
            <template v-else>
              <div class="flex items-center flex-1 min-w-0">
                <el-icon class="text-gray-400 mr-2 cursor-move flex-none">
                  <Rank />
                </el-icon>
                <span class="truncate text-gray-700 dark:text-gray-300">
                  {{ prompt }}
                </span>
              </div>
              <div class="flex-none space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <el-button
                  size="small"
                  text
                  :icon="Edit"
                  @click="startEdit(index)"
                />
                <el-button
                  size="small"
                  text
                  type="danger"
                  :icon="Delete"
                  @click="deletePrompt(index)"
                />
              </div>
            </template>
          </div>
        </TransitionGroup>
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-12 text-gray-400"
      >
        <el-icon :size="48" class="mb-4">
          <Document />
        </el-icon>
        <p>{{ $t('copilot.promptManager.empty') }}</p>
        <p class="text-sm mt-1">
          {{ $t('copilot.promptManager.emptyHint') }}
        </p>
      </div>

      <!-- 预设指令 -->
      <div class="mt-4">
        <el-divider content-position="left">
          <span class="text-sm text-gray-500">{{ $t('copilot.promptManager.presets') }}</span>
        </el-divider>
        <div class="flex flex-wrap gap-2">
          <el-tag
            v-for="preset in presetPrompts"
            :key="preset"
            class="cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            effect="plain"
            @click="addPresetPrompt(preset)"
          >
            <el-icon class="mr-1">
              <Plus />
            </el-icon>
            {{ preset }}
          </el-tag>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <el-button type="danger" plain @click="clearAllPrompts">
          <el-icon class="mr-1">
            <Delete />
          </el-icon>
          {{ $t('copilot.promptManager.clearAll') }}
        </el-button>
        <el-button type="primary" @click="visible = false">
          {{ $t('common.done') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Delete, Document, Edit, EditPen, Plus, Rank } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

// 控制弹窗显示
const visible = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 指令列表
const prompts = ref([])

// 新指令输入
const newPrompt = ref('')

// 编辑状态
const editingIndex = ref(-1)
const editingValue = ref('')

// 预设指令
const presetPrompts = [
  '打开微信',
  '打开支付宝扫码',
  '打开抖音并点赞',
  '打开相机拍照',
  '打开设置',
  '打开浏览器搜索',
  '发送短信',
  '拨打电话',
]

// 加载指令
const loadPrompts = () => {
  const config = window.copilot?.getConfig?.() || {}
  prompts.value = [...(config.prompts || [])]
}

// 保存指令
const savePrompts = () => {
  window.copilot?.setConfig?.('prompts', [...prompts.value])
}

// 添加指令
const addPrompt = () => {
  const text = newPrompt.value.trim()
  if (!text) {
    ElMessage.warning(t('copilot.promptManager.emptyInput'))
    return
  }

  if (prompts.value.includes(text)) {
    ElMessage.warning(t('copilot.promptManager.duplicate'))
    return
  }

  prompts.value.push(text)
  newPrompt.value = ''
  savePrompts()
  ElMessage.success(t('copilot.promptManager.addSuccess'))
}

// 添加预设指令
const addPresetPrompt = (preset) => {
  if (prompts.value.includes(preset)) {
    ElMessage.warning(t('copilot.promptManager.duplicate'))
    return
  }

  prompts.value.push(preset)
  savePrompts()
  ElMessage.success(t('copilot.promptManager.addSuccess'))
}

// 开始编辑
const startEdit = (index) => {
  editingIndex.value = index
  editingValue.value = prompts.value[index]
}

// 保存编辑
const saveEdit = (index) => {
  const text = editingValue.value.trim()
  if (!text) {
    ElMessage.warning(t('copilot.promptManager.emptyInput'))
    return
  }

  prompts.value[index] = text
  editingIndex.value = -1
  editingValue.value = ''
  savePrompts()
  ElMessage.success(t('copilot.promptManager.editSuccess'))
}

// 取消编辑
const cancelEdit = () => {
  editingIndex.value = -1
  editingValue.value = ''
}

// 删除指令
const deletePrompt = async (index) => {
  try {
    await ElMessageBox.confirm(
      t('copilot.promptManager.deleteConfirm'),
      t('copilot.promptManager.deleteTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      },
    )

    prompts.value.splice(index, 1)
    savePrompts()
    ElMessage.success(t('copilot.promptManager.deleteSuccess'))
  }
  catch {
    // 用户取消
  }
}

// 清空所有指令
const clearAllPrompts = async () => {
  if (prompts.value.length === 0)
    return

  try {
    await ElMessageBox.confirm(
      t('copilot.promptManager.clearAllConfirm'),
      t('copilot.promptManager.clearAllTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      },
    )

    prompts.value = []
    savePrompts()
    ElMessage.success(t('copilot.promptManager.clearAllSuccess'))
  }
  catch {
    // 用户取消
  }
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>

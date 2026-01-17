<template>
  <el-dialog
    v-model="dialog.visible"
    :title="$t('copilot.promptManager.title')"
    width="600px"
    destroy-on-close
    append-to-body
    fullscreen
    center
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen"
    :close-on-click-modal="false"
    @open="onOpen"
  >
    <div class="h-full flex flex-col overflow-auto">
      <div
        class="flex-none pr-1"
      >
        <Swapy
          :key="prompts.join()"
          class="space-y-2"
          :config="{ animation: 'dynamic', dragAxis: 'y', autoScrollOnDrag: true }"
          :enabled="editingIndex === -1"
          @swap-end="onSwapEnd"
        >
          <SwapyItem
            v-for="(prompt, index) of prompts"
            :key="prompt"
            class=""
            v-bind="{
              slotId: prompt,
              itemId: prompt,
            }"
          >
            <el-card
              class="!rounded-xl"
              shadow="hover"
              body-class="!p-0"
            >
              <div class="p-4 justify-between group">
                <div v-if="editingIndex === index" class="flex flex-col items-end gap-2">
                  <el-input
                    :ref="(val) => onInputRef(val, index)"
                    v-model="editingValue"
                    class="flex-none"
                    clearable
                    type="textarea"
                    :placeholder="$t('copilot.promptManager.inputPlaceholder')"
                    :autosize="{ minRows: 3 }"
                    @keydown.enter.prevent="onSaveClick(index)"
                    @keydown.escape="onCancelClick"
                  />
                  <div class="flex-none space-x-1">
                    <el-button type="primary" @click="onSaveClick(index)">
                      {{ $t('common.save') }}
                    </el-button>
                    <el-button @click="onCancelClick">
                      {{ $t('common.cancel') }}
                    </el-button>
                  </div>
                </div>
                <div v-else class="flex items-center">
                  <div class="flex items-center flex-1 min-w-0 cursor-move">
                    <el-icon class="text-gray-400 mr-2 flex-none">
                      <Rank />
                    </el-icon>
                    <span class="truncate text-gray-700 dark:text-gray-300">
                      {{ prompt }}
                    </span>
                  </div>
                  <div class="flex-none space-x-1">
                    <el-button
                      text
                      type="primary"
                      icon="Plus"
                      circle
                      @click="onAddClick(index)"
                    />
                    <el-button
                      text
                      type="primary"
                      icon="Edit"
                      circle
                      @click="onEditClick(index)"
                    />
                    <el-button
                      text
                      type="danger"
                      icon="Delete"
                      circle
                      @click="deletePrompt(index)"
                    />
                  </div>
                </div>
              </div>
            </el-card>
          </SwapyItem>
        </Swapy>
      </div>

      <div class="flex-1 min-h-0 relative">
        <el-result v-if="!prompts.length" class="absolute inset-0 flex items-center justify-center" icon="info" :title="$t('copilot.promptManager.empty')" :sub-title="$t('copilot.promptManager.emptyHint')">
          <template #icon>
            <el-icon :size="64" class="text-gray-400">
              <ElIconCollection />
            </el-icon>
          </template>
          <template #extra>
            <el-button type="primary" icon="Plus" @click="onAddClick()">
              {{ $t('copilot.promptManager.add') }}
            </el-button>
          </template>
        </el-result>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <el-button :disabled="!prompts.length" type="danger" plain @click="onResetClick">
          <el-icon class="mr-1">
            <Delete />
          </el-icon>
          {{ $t('copilot.promptManager.clearAll') }}
        </el-button>

        <el-button type="primary" @click="dialog.close()">
          {{ $t('common.done') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { t } from '$/locales/index.js'

const props = defineProps({

})

const emit = defineEmits([])

const NEW_PROMPT = 'New Prompt'

const copilotStore = useCopilotStore()

const dialog = useDialog()

const prompts = computed({
  get() {
    const storedPrompts = copilotStore.config?.prompts || []
    return storedPrompts
  },
  set(val) {
    copilotStore.updateConfig({ prompts: val })
  },
})

const editingIndex = ref(-1)
const editingValue = ref('')

function onOpen() {
}

async function onInputRef(val, index) {
  if (index === editingIndex.value) {
    await nextTick()
    val?.textarea?.focus?.()
  }
}

function createPromptPlaceholder() {
  const value = `${NEW_PROMPT} ${prompts.value.length + 1}`

  if (!prompts.value.includes(value)) {
    return value
  }

  return `${value}_${Date.now()}`
}

function onAddClick(index = -1) {
  prompts.value.splice(index + 1, 0, createPromptPlaceholder())
  editingValue.value = ''
  editingIndex.value = index + 1
}

function onEditClick(index) {
  editingIndex.value = index
  editingValue.value = prompts.value[index]
}

function onSaveClick(index) {
  const text = editingValue.value.trim()

  if (!text) {
    ElMessage.warning(t('copilot.promptManager.emptyInput'))
    return false
  }

  if (prompts.value.includes(text)) {
    ElMessage.warning(t('copilot.promptManager.duplicate'))
    return false
  }

  prompts.value[index] = text
  editingIndex.value = -1
  editingValue.value = ''
  savePrompts()
  ElMessage.success(t('copilot.promptManager.editSuccess'))
}

function savePrompts() {
  copilotStore.updateConfig()
}

function onCancelClick() {
  editingIndex.value = -1
  editingValue.value = ''
}

async function deletePrompt(index) {
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
  }
}

async function onResetClick() {
  if (prompts.value.length === 0) {
    return
  }

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
  }
  catch {
    return false
  }

  prompts.value = []
  savePrompts()

  ElMessage.success(t('copilot.promptManager.clearAllSuccess'))
}

function onSwapEnd(event) {
  const sortPrompts = event.slotItemMap.asArray.map(obj => obj.item)
  prompts.value = sortPrompts
  savePrompts()
}

defineExpose({
  ...dialog,
})
</script>

<style scoped>
</style>

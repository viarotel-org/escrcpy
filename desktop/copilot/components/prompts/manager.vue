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
    @open="loadPrompts"
  >
    <div class="space-y-4 h-full flex flex-col overflow-hidden -mr-1">
      <!-- Add new prompt -->
      <div class="flex-none flex space-x-2 pr-1">
        <el-input
          v-model="newPrompt"
          :placeholder="$t('copilot.promptManager.inputPlaceholder')"
          clearable
          class="flex-1 min-w-0"
          @keydown.enter.prevent="addPrompt"
        >
          <template #prefix>
            <el-icon><EditPen /></el-icon>
          </template>
        </el-input>

        <el-button class="flex-none" type="primary" icon="Plus" @click="addPrompt">
          {{ $t('copilot.promptManager.add') }}
        </el-button>
      </div>

      <div
        class="flex-1 min-h-0 overflow-auto pr-1 relative"
      >
        <Swapy
          v-if="prompts.length > 0"
          class="space-y-2"
          :config="{ animation: 'dynamic', dragAxis: 'y', autoScrollOnDrag: true }"
          @swap-end="onSwapEnd"
        >
          <SwapyItem
            v-for="(prompt, index) of prompts"
            :key="prompt + index"
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
              <div class="flex items-center p-4 justify-between group">
                <!-- Edit mode -->
                <template v-if="editingIndex === index">
                  <el-autocomplete
                    v-model="editingValue"
                    class="flex-1 mr-2"
                    clearable
                    :fetch-suggestions="fetchSuggestions"
                    @keydown.enter.prevent="saveEdit(index)"
                    @keydown.escape="cancelEdit"
                  />
                  <div class="flex-none space-x-1">
                    <el-button type="primary" @click="saveEdit(index)">
                      {{ $t('common.save') }}
                    </el-button>
                    <el-button @click="cancelEdit">
                      {{ $t('common.cancel') }}
                    </el-button>
                  </div>
                </template>

                <!-- Display mode -->
                <template v-else>
                  <div class="flex items-center flex-1 min-w-0 cursor-move">
                    <el-icon class="text-gray-400 mr-2 flex-none">
                      <Rank />
                    </el-icon>
                    <span class="truncate text-gray-700 dark:text-gray-300">
                      {{ prompt }}
                    </span>
                  </div>
                  <div class="flex-none space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <el-button
                      text
                      icon="Edit"
                      circle
                      @click="startEdit(index)"
                    />
                    <el-button
                      text
                      type="danger"
                      icon="Delete"
                      circle
                      @click="deletePrompt(index)"
                    />
                  </div>
                </template>
              </div>
            </el-card>
          </SwapyItem>
        </Swapy>

        <el-result v-else class="absolute inset-0 flex items-center justify-center" icon="info" :title="$t('copilot.promptManager.empty')" :sub-title="$t('copilot.promptManager.emptyHint')">
          <template #icon>
            <el-icon :size="64" class="text-gray-400">
              <ElIconDocument />
            </el-icon>
          </template>
        </el-result>
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
        <el-button type="primary" @click="dialog.close()">
          {{ $t('common.done') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { t } from '$/locales/index.js'
import copilotClient from '$copilot/services/index.js'
import { copilotPromptBus } from './helper.js'

const props = defineProps({

})

const emit = defineEmits([])

const dialog = useDialog()

// Prompts list
const prompts = ref([])

// New prompt input
const newPrompt = ref('')

// Edit state
const editingIndex = ref(-1)
const editingValue = ref('')

// Load prompts
const loadPrompts = async () => {
  const config = await copilotClient.getConfig() || {}
  prompts.value = [...(config.prompts || [])]
}

// Save prompts
const savePrompts = async () => {
  await copilotClient.setConfig([...prompts.value], 'prompts')
  copilotPromptBus.emit(prompts.value)
}

// Add prompt
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

// Start editing
const startEdit = (index) => {
  editingIndex.value = index
  editingValue.value = prompts.value[index]
}

// Save edit
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

// Cancel edit
const cancelEdit = () => {
  editingIndex.value = -1
  editingValue.value = ''
}

// Delete prompt
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
    // User cancelled
  }
}

// Clear all prompts
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
    // User cancelled
  }
}

function onSwapEnd(event) {
  const sortPrompts = event.slotItemMap.asArray.map(obj => obj.item)
  prompts.value = sortPrompts
  savePrompts()
}

async function fetchSuggestions(queryString, cb) {
  const prompts = []

  const suggestions = prompts.filter(prompt =>
    prompt.toLowerCase().includes(queryString.toLowerCase()) && prompt !== editingValue.value,
  )

  cb(suggestions.map(prompt => ({ value: prompt })))
}

defineExpose({
  ...dialog,
})
</script>

<style scoped>
</style>

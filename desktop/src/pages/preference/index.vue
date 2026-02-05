<template>
  <div class="h-full flex flex-col overflow-hidden pt-2">
    <div
      class="mr-4 pb-2 flex items-center justify-between flex-none"
    >
      <div class="flex-none">
        <ScopeSelect
          v-model="deviceScope"
          @change="onScopeChange"
          @device-change="onDeviceChange"
        />
      </div>
      <el-button-group class="flex-none">
        <el-button :title="$t('preferences.config.import.name')" icon="Upload" plain @click="handleImport">
        </el-button>
        <el-button :title="$t('preferences.config.export.name')" icon="Download" plain @click="handleExport">
        </el-button>
        <el-button :title="$t('preferences.config.edit.name')" icon="Edit" plain @click="handleEdit">
        </el-button>
        <el-button :title="$t('preferences.config.reset.name')" icon="RefreshRight" plain @click="handleReset">
        </el-button>
      </el-button-group>
    </div>

    <div class="pr-2 flex-1 min-h-0">
      <PreferenceForm
        v-model="preferenceData"
        v-bind="{
          deviceScope,
        }"
      >
      </PreferenceForm>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'

import PreferenceForm from '$/components/preference-form/index.vue'
import ScopeSelect from './components/scope-select/index.vue'

const preferenceStore = usePreferenceStore()
const themeStore = useThemeStore()

const preferenceData = computed({
  get() {
    return preferenceStore.data
  },
  set(value) {
    preferenceStore.data = value
  },
})

const deviceScope = computed({
  get() {
    return preferenceStore.deviceScope
  },
  set(value) {
    preferenceStore.setScope(value)
  },
})

onActivated(() => {
  deviceScope.value = 'global'
})

function onDeviceChange(options) {
  const hasCurrentScope = options.some(item => item.value === deviceScope.value)

  if (hasCurrentScope)
    return false

  deviceScope.value = 'global'
}

async function handleReset() {
  try {
    await ElMessageBox.confirm(window.t('preferences.config.reset.tips'), window.t('common.tips'), {
      type: 'warning',
    })
  }
  catch (error) {
    return false
  }

  preferenceStore.reset(deviceScope.value)
}

function onScopeChange(value) {
  deviceScope.value = value
}

async function handleImport() {
  try {
    await window.$preload.ipcRenderer.invoke('show-open-dialog', {
      preset: 'replaceFile',
      filePath: window.$preload.store.getPath(),
      filters: [
        {
          name: window.t('preferences.config.import.placeholder'),
          extensions: ['json'],
        },
      ],
    })

    ElMessage.success(window.t('preferences.config.import.success'))
    preferenceStore.init()
  }
  catch (error) {
    if (error.message) {
      const message = error.message?.match(/Error: (.*)/)?.[1]
      ElMessage.warning(message || error.message)
    }
  }
}

function handleEdit() {
  window.$preload.store.openInEditor()
}

async function handleExport() {
  const message = ElMessage.loading(
    window.t('preferences.config.export.message'),
  )

  try {
    await window.$preload.ipcRenderer.invoke('show-save-dialog', {
      defaultPath: 'escrcpy-configs.json',
      filePath: window.$preload.store.getPath(),
      filters: [
        {
          name: window.t('preferences.config.export.placeholder'),
          extensions: ['json'],
        },
      ],
    })

    ElMessage.success(window.t('preferences.config.export.success'))
  }
  catch (error) {
    if (error.message) {
      const message = error.message?.match(/Error: (.*)/)?.[1]
      ElMessage.warning(message || error.message)
    }
  }

  message.close()
}

const handleSave = debounce(_handleSave, 500)

watch(() => JSON.stringify(preferenceData.value), () => {
  handleSave()
})

watch(() => preferenceData.value.theme, (val) => {
  themeStore.update(val)
})

function _handleSave() {
  preferenceStore.setData(preferenceData.value)
}
</script>

<style scoped lang="postcss">
:deep(.el-collapse-item__arrow) {
  @apply w-2em;
}
</style>

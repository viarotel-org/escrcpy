<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div
      class="mr-4 pb-2 flex items-center justify-between flex-none border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex-none">
        <ScopeSelect
          v-model="deviceScope"
          @change="onScopeChange"
          @device-change="onDeviceChange"
        />
      </div>
      <el-button-group class="flex-none">
        <EleTooltipButton placement="bottom" :content="$t('preferences.config.import.name')" icon="Upload" plain @click="handleImport">
        </EleTooltipButton>
        <EleTooltipButton placement="bottom" :content="$t('preferences.config.export.name')" icon="Download" plain @click="handleExport">
        </EleTooltipButton>
        <EleTooltipButton placement="bottom" :content="$t('preferences.config.edit.name')" icon="Edit" plain @click="handleEdit">
        </EleTooltipButton>
        <EleTooltipButton placement="bottom" :content="$t('preferences.config.reset.name')" icon="RefreshRight" plain @click="handleReset">
        </EleTooltipButton>
      </el-button-group>
    </div>

    <div class="pr-2 pt-4 flex-1 h-0 overflow-auto">
      <PreferenceForm
        v-model="preferenceData"
        v-bind="{
          deviceScope,
        }"
      >
      </PreferenceForm>
      <div class="h-4"></div>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'

import { usePreferenceStore } from '$/store/index.js'

import PreferenceForm from '$/components/PreferenceForm/index.vue'
import ScopeSelect from './components/ScopeSelect/index.vue'

const preferenceStore = usePreferenceStore()

const { proxy } = getCurrentInstance()

const preferenceData = ref(preferenceStore.data)
const deviceScope = ref(preferenceStore.deviceScope)

function onDeviceChange(options) {
  const hasCurrentScope = options.some(item => item.value === deviceScope.value)

  if (hasCurrentScope)
    return false

  deviceScope.value = 'global'
  preferenceStore.setScope(deviceScope.value)
  preferenceData.value = preferenceStore.data
}

function handleReset() {
  preferenceStore.reset(deviceScope.value)
  preferenceData.value = preferenceStore.data
}

function onScopeChange(value) {
  preferenceStore.setScope(value)
  preferenceData.value = preferenceStore.data
}

async function handleImport() {
  try {
    await proxy.$electron.ipcRenderer.invoke('show-open-dialog', {
      preset: 'replaceFile',
      filePath: proxy.$appStore.path,
      filters: [
        {
          name: proxy.$t('preferences.config.import.placeholder'),
          extensions: ['json'],
        },
      ],
    })

    proxy.$message.success(proxy.$t('preferences.config.import.success'))
    preferenceData.value = preferenceStore.init()
  }
  catch (error) {
    if (error.message) {
      const message = error.message?.match(/Error: (.*)/)?.[1]
      proxy.$message.warning(message || error.message)
    }
  }
}

function handleEdit() {
  proxy.$appStore.openInEditor()
}

async function handleExport() {
  const messageEl = proxy.$message.loading(
    proxy.$t('preferences.config.export.message'),
  )

  try {
    await proxy.$electron.ipcRenderer.invoke('show-save-dialog', {
      defaultPath: 'escrcpy-configs.json',
      filePath: proxy.$appStore.path,
      filters: [
        {
          name: proxy.$t('preferences.config.export.placeholder'),
          extensions: ['json'],
        },
      ],
    })

    proxy.$message.success(proxy.$t('preferences.config.export.success'))
  }
  catch (error) {
    if (error.message) {
      const message = error.message?.match(/Error: (.*)/)?.[1]
      proxy.$message.warning(message || error.message)
    }
  }

  messageEl.close()
}

function _handleSave() {
  preferenceStore.setData(preferenceData.value)
}
const handleSave = debounce(_handleSave, 1000)

watch(preferenceData, () => {
  handleSave()
}, { deep: true })

watch(() => preferenceData.value.theme, (value) => {
  proxy.$store.theme.update(value)
  window.electron.ipcRenderer.send('theme-change', value)
})

onActivated(() => {
  preferenceData.value = preferenceStore.data
  deviceScope.value = preferenceStore.deviceScope
})
</script>

<style scoped lang="postcss">
:deep(.el-collapse-item__arrow) {
  @apply w-2em;
}
</style>

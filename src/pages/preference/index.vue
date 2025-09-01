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

import PreferenceForm from '$/components/PreferenceForm/index.vue'
import ScopeSelect from './components/ScopeSelect/index.vue'

const { proxy } = getCurrentInstance()

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
    preferenceStore.init()
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
  const message = proxy.$message.loading(
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

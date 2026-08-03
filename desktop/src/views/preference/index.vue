<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div
      class="mr-3 pb-2 flex items-center justify-between flex-none"
    >
      <div class="flex-none">
        <ScopeSelect
          v-model="deviceScope"
          @change="onScopeChange"
          @device-change="onDeviceChange"
        />
      </div>
      <el-button-group class="flex-none">
        <el-button :title="$t('common.import')" icon="Upload" plain @click="handleImport">
        </el-button>
        <el-button :title="$t('common.export')" icon="Download" plain @click="handleExport">
        </el-button>
        <el-button :title="$t('preferences.config.edit.name')" icon="Edit" plain @click="handleEdit">
        </el-button>
        <el-button :title="$t('preferences.config.reset.name')" icon="RefreshRight" plain @click="handleReset">
        </el-button>
      </el-button-group>
    </div>

    <div class="flex-1 min-h-0">
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

const configFile = useConfigFile()

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
  configFile.importConfig({
    onSuccess: () => {
      preferenceStore.init()
    },
  })
}

function handleEdit() {
  configFile.editConfig()
}

async function handleExport() {
  configFile.exportConfig()
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
</style>

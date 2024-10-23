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
        <el-button type="" icon="Upload" plain @click="handleImport">
          {{ $t('preferences.config.import.name') }}
        </el-button>
        <el-button type="" icon="Download" plain @click="handleExport">
          {{ $t('preferences.config.export.name') }}
        </el-button>
        <el-button type="" icon="Edit" plain @click="handleEdit">
          {{ $t('preferences.config.edit.name') }}
        </el-button>
        <el-button type="" icon="RefreshRight" plain @click="handleReset">
          {{ $t('preferences.config.reset.name') }}
        </el-button>
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
    </div>
  </div>
</template>

<script>
import { usePreferenceStore } from '$/store/index.js'

import { debounce } from 'lodash-es'
import PreferenceForm from './components/PreferenceForm/index.vue'

import ScopeSelect from './components/ScopeSelect/index.vue'

export default {
  components: {
    ScopeSelect,
    PreferenceForm,
  },
  setup() {
    const preferenceStore = usePreferenceStore()

    const preferenceData = ref(preferenceStore.data)

    const deviceScope = ref(preferenceStore.deviceScope)

    return {
      preferenceStore,
      preferenceData,
      deviceScope,
    }
  },
  watch: {
    'preferenceData': {
      handler() {
        this.handleSave()
      },
      deep: true,
    },
    'preferenceData.theme': {
      handler(value) {
        this.$store.theme.update(value)
        window.electron.ipcRenderer.send('theme-change', value)
      },
    },
    'preferenceData.adbPath': {
      handler() {
        this.handleDevices()
      },
    },
  },
  created() {
    this.handleSave = debounce(this.handleSave, 1000)
    this.handleDevices = debounce(this.handleDevices, 1000)
  },
  methods: {
    onDeviceChange(options) {
      const device = options.some(
        item => this.$replaceIP(item.value) === this.deviceScope,
      )

      if (device) {
        return false
      }

      this.deviceScope = 'global'
      this.preferenceStore.setScope(this.deviceScope)
      this.preferenceData = this.preferenceStore.data
    },
    handleDevices() {
      this.$root.reRenderPost()
    },
    handleReset() {
      this.preferenceStore.reset(this.deviceScope)
      this.preferenceData = this.preferenceStore.data
    },

    onScopeChange(value) {
      this.preferenceStore.setScope(value)
      this.preferenceData = this.preferenceStore.data
    },

    async handleImport() {
      try {
        await this.$electron.ipcRenderer.invoke('show-open-dialog', {
          preset: 'replaceFile',
          filePath: this.$appStore.path,
          filters: [
            {
              name: this.$t('preferences.config.import.placeholder'),
              extensions: ['json'],
            },
          ],
        })

        this.$message.success(this.$t('preferences.config.import.success'))

        this.preferenceData = this.preferenceStore.init()
      }
      catch (error) {
        if (error.message) {
          const message = error.message?.match(/Error: (.*)/)?.[1]
          this.$message.warning(message || error.message)
        }
      }
    },

    handleEdit() {
      this.$appStore.openInEditor()
    },

    async handleExport() {
      const messageEl = this.$message.loading(
        this.$t('preferences.config.export.message'),
      )

      try {
        await this.$electron.ipcRenderer.invoke('show-save-dialog', {
          defaultPath: 'escrcpy-configs.json',
          filePath: this.$appStore.path,
          filters: [
            {
              name: this.$t('preferences.config.export.placeholder'),
              extensions: ['json'],
            },
          ],
        })
        this.$message.success(this.$t('preferences.config.export.success'))
      }
      catch (error) {
        if (error.message) {
          const message = error.message?.match(/Error: (.*)/)?.[1]
          this.$message.warning(message || error.message)
        }
      }

      messageEl.close()
    },

    handleSave() {
      this.preferenceStore.setData(this.preferenceData)

      this.$message({
        message: this.$t('preferences.config.save.placeholder'),
        type: 'success',
        grouping: true,
      })
    },
  },
}
</script>

<style scoped lang="postcss">
:deep(.el-collapse-item__header) {
  @apply h-13 leading-13;
}

:deep(.el-collapse-item__arrow) {
  @apply w-2em;
}
</style>

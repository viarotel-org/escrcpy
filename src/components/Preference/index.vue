<template>
  <div class="h-full flex flex-col overflow-hidden pt-1">
    <div
      class="mr-4 pb-4 flex items-center justify-between flex-none border-b border-gray-200 dark:border-gray-700"
    >
      <div class="">
        <el-select
          v-model="deviceScope"
          value-key=""
          :placeholder="$t('preferences.scope.placeholder')"
          filterable
          :no-data-text="$t('preferences.scope.no-data')"
          class="!w-90"
          @change="onScopeChange"
        >
          <template #prefix>
            <el-tooltip class="" effect="dark" placement="bottom-start">
              <el-icon class="text-primary-300 hover:text-primary-500">
                <QuestionFilled />
              </el-icon>
              <template #content>
                <div class="space-y-1">
                  <div class="pb-1">
                    {{ $t('preferences.scope.details[0]') }}
                  </div>
                  <div class="">
                    {{ $t('preferences.scope.details[1]') }}
                  </div>
                  <div class="">
                    {{ $t('preferences.scope.details[2]') }}
                  </div>
                </div>
              </template>
            </el-tooltip>
          </template>
          <el-option
            v-for="item in scopeList"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="">
        <el-button type="" icon="Upload" plain @click="handleImport">
          {{ $t('preferences.config.import.name') }}
        </el-button>
        <el-button type="" icon="Download" plain @click="handleExport">
          {{ $t('preferences.config.export.name') }}
        </el-button>
        <el-button type="" icon="Edit" plain @click="handleEdit">
          {{ $t('preferences.config.edit.name') }}
        </el-button>
        <el-button type="" icon="RefreshRight" plain @click="handleResetAll">
          {{ $t('preferences.config.reset.name') }}
        </el-button>
      </div>
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
import { debounce } from 'lodash-es'

import PreferenceForm from './components/PreferenceForm/index.vue'

import { usePreferenceStore } from '$/store/index.js'

export default {
  components: {
    PreferenceForm,
  },
  setup() {
    const preferenceStore = usePreferenceStore()

    const preferenceData = ref(preferenceStore.data)
    const deviceScope = ref(preferenceStore.deviceScope)

    return {
      preferenceData,
      deviceScope,
    }
  },
  computed: {
    commonPreferenceModel() {
      return this.$store.preference.model?.common || {}
    },
    preferenceModel() {
      return this.$store.preference.model || {}
    },
    scopeList() {
      const value = this.$store.device.list.map(item => ({
        ...item,
        label: `${item.id}（${item.$name}${
          item.$remark ? `，${item.$remark}` : ''
        }）`,
        value: item.id,
      }))

      value.unshift({
        label: `Global（${this.$t('preferences.scope.global')}）`,
        value: 'global',
      })

      return value
    },
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
      },
    },
    'preferenceData.adbPath': {
      handler() {
        this.handleDevices()
      },
    },
    // 列表设备发生变化后如果没有匹配到则默认选中 global
    'scopeList': {
      handler(value) {
        const someValue = value.some(
          item => this.$replaceIP(item.value) === this.deviceScope,
        )

        if (someValue) {
          return
        }

        this.deviceScope = 'global'
        this.$store.preference.setScope(this.deviceScope)
        this.preferenceData = this.$store.preference.data
      },
      immediate: true,
    },
  },
  created() {
    this.handleSave = debounce(this.handleSave, 1000)
    this.handleDevices = debounce(this.handleDevices, 1000)
  },
  methods: {
    handleDevices() {
      this.$root.reRenderPost()
    },
    subModel(item) {
      const children = item?.children || {}
      const value = {}
      Object.entries(children).forEach(([key, data]) => {
        if (!data.hidden) {
          value[key] = data
        }
      })
      return value
    },
    handleResetAll() {
      this.$store.preference.reset(this.deviceScope)
      this.preferenceData = this.$store.preference.data
    },

    onScopeChange(value) {
      this.$store.preference.setScope(value)
      this.preferenceData = this.$store.preference.data
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

        this.preferenceData = this.$store.preference.init()
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
      this.$store.preference.setData(this.preferenceData)
      this.$message.success(this.$t('preferences.config.save.placeholder'))
    },

    handleReset(type) {
      this.preferenceData = {
        ...this.preferenceData,
        ...this.$store.preference.getDefaultData(type),
      }
      this.$store.preference.setData(this.preferenceData)
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

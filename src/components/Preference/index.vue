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

    <div class="grid gap-6 pr-2 pt-4 flex-1 h-0 overflow-auto">
      <el-collapse v-model="collapseValues" class="space-y-4 borderless">
        <el-collapse-item
          v-for="(item, name) of preferenceModel"
          :key="name"
          :name="name"
          class="!border dark:border-gray-700 rounded-[5px] overflow-hidden shadow-el-lighter"
        >
          <template #title>
            <div
              class="flex items-center w-full text-left -mr-10 overflow-hidden dark:border-gray-700"
              :class="{
                '!border-b': collapseValues.includes(name),
              }"
            >
              <div class="flex-1 w-0 truncate pl-4 text-base">
                {{ $t(item.label) }}
              </div>
              <div class="flex-none pl-4 pr-12" @click.stop>
                <el-button type="primary" text @click="handleReset(name)">
                  {{ $t('preferences.reset') }}
                </el-button>
              </div>
            </div>
          </template>
          <div class="pt-4">
            <el-form
              ref="elForm"
              :model="preferenceData"
              label-width="225px"
              class="pr-8 pt-4"
            >
              <el-row :gutter="20">
                <el-col
                  v-for="(item_1, name_1) of subModel(item)"
                  :key="name_1"
                  :span="item_1.span || 12"
                  :offset="item_1.offset || 0"
                >
                  <el-form-item :label="$t(item_1.label)" :prop="item_1.field">
                    <template #label>
                      <div class="flex items-center">
                        <el-tooltip
                          v-if="item_1.tips"
                          class=""
                          effect="dark"
                          :content="$t(item_1.tips)"
                          placement="bottom"
                        >
                          <el-link
                            class="mr-1 !text-base"
                            icon="InfoFilled"
                            type="warning"
                            :underline="false"
                          >
                          </el-link>
                        </el-tooltip>
                        <span class="" :title="$t(item_1.placeholder)">{{
                          $t(item_1.label)
                        }}</span>
                      </div>
                    </template>

                    <el-input
                      v-if="item_1.type === 'Input'"
                      v-bind="item_1.props || {}"
                      v-model="preferenceData[item_1.field]"
                      class="!w-full"
                      :title="$t(item_1.placeholder)"
                      :placeholder="$t(item_1.placeholder)"
                      clearable
                    >
                      <template v-if="item_1.append" #append>
                        {{ item_1.append }}
                      </template>
                    </el-input>

                    <el-input
                      v-else-if="item_1.type === 'Input.number'"
                      v-bind="item_1.props || {}"
                      v-model.number="preferenceData[item_1.field]"
                      class="!w-full"
                      :title="$t(item_1.placeholder)"
                      :placeholder="$t(item_1.placeholder)"
                      clearable
                    >
                      <template v-if="item_1.append" #append>
                        {{ item_1.append }}
                      </template>
                    </el-input>

                    <el-switch
                      v-else-if="item_1.type === 'Switch'"
                      v-bind="item_1.props || {}"
                      v-model="preferenceData[item_1.field]"
                      class="!w-full"
                      :title="$t(item_1.placeholder)"
                    ></el-switch>

                    <el-select
                      v-else-if="item_1.type === 'Select'"
                      v-bind="item_1.props || {}"
                      v-model="preferenceData[item_1.field]"
                      class="!w-full"
                      :title="$t(item_1.placeholder)"
                      :placeholder="$t(item_1.placeholder)"
                    >
                      <el-option
                        v-for="(item_2, index_2) in item_1.options"
                        :key="index_2"
                        :label="$t(item_2.label)"
                        :value="item_2.value"
                        :title="$t(item_2.placeholder || item_2.label)"
                      >
                      </el-option>
                    </el-select>

                    <component
                      :is="item_1.type"
                      v-else
                      v-model="preferenceData[item_1.field]"
                      :data="item_1"
                      :device-scope="deviceScope"
                      :preference-data="preferenceData"
                    ></component>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash-es'
import { ref } from 'vue'

import { useOtg } from './composables/otg/index.js'

import LanguageSelect from './components/LanguageSelect/index.vue'
import PathInput from './components/PathInput/index.vue'
import VideoCodecSelect from './components/VideoCodecSelect/index.vue'
import AudioCodecSelect from './components/AudioCodecSelect/index.vue'
import DisplaySelect from './components/DisplaySelect/index.vue'
import KeyboardInjectSelect from './components/KeyboardInjectSelect/index.vue'

import { usePreferenceStore } from '$/store/index.js'
import LoadingIcon from '$/components/Device/components/LoadingIcon/index.vue'

export default {
  components: {
    LanguageSelect,
    PathInput,
    VideoCodecSelect,
    AudioCodecSelect,
    DisplaySelect,
    KeyboardInjectSelect,
  },
  setup() {
    const preferenceStore = usePreferenceStore()

    const preferenceData = ref(preferenceStore.data)
    const deviceScope = ref(preferenceStore.deviceScope)

    const collapseValues = ref(Object.keys(preferenceStore.model))

    useOtg(preferenceData)

    return {
      preferenceData,
      deviceScope,
      collapseValues,
    }
  },
  computed: {
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
      const messageEl = this.$message({
        message: this.$t('preferences.config.export.message'),
        icon: LoadingIcon,
        duration: 0,
      })

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

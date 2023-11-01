<template>
  <div class="">
    <div class="pb-4 pr-2 flex items-center justify-between">
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
                    {{ $t("preferences.scope.details[0]") }}
                  </div>
                  <div class="">
                    {{ $t("preferences.scope.details[1]") }}
                  </div>
                  <div class="">
                    {{ $t("preferences.scope.details[2]") }}
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
          {{ $t("preferences.config.import.name") }}
        </el-button>
        <el-button type="" icon="Download" plain @click="handleExport">
          {{ $t("preferences.config.export.name") }}
        </el-button>
        <el-button type="" icon="Edit" plain @click="handleEdit">
          {{ $t("preferences.config.edit.name") }}
        </el-button>
        <el-button type="" icon="RefreshRight" plain @click="handleResetAll">
          {{ $t("preferences.config.reset.name") }}
        </el-button>
      </div>
    </div>
    <div class="grid gap-6 pr-2">
      <el-card
        v-for="(item, parentId) of preferenceModel"
        :key="parentId"
        shadow="hover"
        class=""
      >
        <template #header>
          <div class="flex items-center">
            <div class="flex-1 w-0 truncate pl-2 text-base">
              {{ $t(item.label) }}
            </div>
            <div class="flex-none pl-4">
              <el-button type="primary" text @click="handleReset(parentId)">
                {{ $t("preferences.reset") }}
              </el-button>
            </div>
          </div>
        </template>
        <div class="">
          <el-form
            ref="elForm"
            :model="preferenceData"
            label-width="170px"
            class="pr-8 pt-4"
          >
            <el-row :gutter="20">
              <el-col
                v-for="(item_1, index_1) of item?.children || {}"
                :key="index_1"
                :span="12"
                :offset="0"
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

                  <el-input
                    v-else-if="item_1.type === 'Input.path'"
                    v-bind="item_1.props || {}"
                    v-model="preferenceData[item_1.field]"
                    clearable
                    class="!w-full"
                    :title="$t(item_1.placeholder)"
                    :placeholder="$t(item_1.placeholder)"
                  >
                    <template #append>
                      <el-button
                        icon="Search"
                        @click="
                          handleSelect(item_1, {
                            properties: item_1.properties,
                            filters: item_1.filters,
                          })
                        "
                      />
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
                    >
                    </el-option>
                  </el-select>

                  <component
                    :is="item_1.type"
                    v-else
                    v-model="preferenceData[item_1.field]"
                    :data="item_1"
                  ></component>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { cloneDeep, debounce } from 'lodash-es'
import LanguageSelect from './LanguageSelect/index.vue'
import { usePreferenceStore } from '@/store/index.js'
import LoadingIcon from '@/components/Device/ControlBar/LoadingIcon/index.vue'

export default {
  components: {
    LanguageSelect,
  },
  data() {
    const preferenceStore = usePreferenceStore()

    return {
      preferenceData: preferenceStore.data,
      deviceScope: preferenceStore.deviceScope,
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
    // 列表设备发生变化后如果没有匹配到则默认选中 global
    'scopeList': {
      handler(value) {
        const someValue = value.some(
          item => this.$replaceIP(item.value) === this.deviceScope,
        )

        if (someValue) {
          return false
        }

        this.deviceScope = 'global'
        this.$store.preference.setScope(this.deviceScope)
        this.preferenceData = this.$store.preference.data
      },
      immediate: true,
    },
  },
  created() {
    this.handleSave = debounce(this.handleSave, 1000, {
      leading: false,
      trailing: true,
    })

    this.getDisplay()
  },
  methods: {
    handleResetAll() {
      this.$store.preference.reset(this.deviceScope)
      this.preferenceData = this.$store.preference.data
    },
    onScopeChange(value) {
      this.$store.preference.setScope(value)
      this.preferenceData = this.$store.preference.data

      if (value === 'global') {
        this.$store.preference.resetModel()
      }

      this.getDisplay()
    },
    async getDisplay() {
      if (this.deviceScope === 'global') {
        return false
      }

      const display = await this.$adb.display(this.deviceScope)

      const displayOptions = display.map(item => ({
        label: item,
        value: item,
      }))

      this.$store.preference.setModel(
        'video.children.display.options',
        displayOptions,
      )
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
    async handleSelect({ field }, options = {}) {
      const { properties, filters } = cloneDeep(options)
      try {
        const defaultPath = this.preferenceData[field]
        const files = await this.$electron.ipcRenderer.invoke(
          'show-open-dialog',
          {
            properties: properties || [],
            filters: filters || [],
            ...(defaultPath
              ? {
                  defaultPath,
                }
              : {}),
          },
        )

        const value = files[0]

        this.preferenceData[field] = value
      }
      catch (error) {
        if (error.message) {
          const message = error.message?.match(/Error: (.*)/)?.[1]
          this.$message.warning(message || error.message)
        }
      }
    },
    handleSave() {
      this.$store.preference.setData(this.preferenceData)
      this.$message.success(this.$t('preferences.config.save.placeholder'))
    },
    getSubModel(item) {
      const data = item?.children() || []

      console.log(`getSubModel.${item.field}.data`, data)

      return data
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
:deep(.el-card) {
  --el-card-padding: 8px;
}
</style>

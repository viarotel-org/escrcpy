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
              {{ item.label }}
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
                v-for="(item_1, index_1) of getSubModel(item)"
                :key="index_1"
                :span="12"
                :offset="0"
              >
                <el-form-item :label="item_1.label" :prop="item_1.field">
                  <template #label>
                    <div class="flex items-center">
                      <el-tooltip
                        v-if="item_1.tips"
                        class=""
                        effect="dark"
                        :content="item_1.tips"
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
                      <span class="" :title="item_1.placeholder">{{
                        item_1.label
                      }}</span>
                    </div>
                  </template>

                  <el-input
                    v-if="item_1.type === 'Input'"
                    v-bind="item_1.props || {}"
                    v-model="preferenceData[item_1.field]"
                    class="!w-full"
                    :title="item_1.placeholder"
                    :placeholder="item_1.placeholder"
                    clearable
                  ></el-input>
                  <el-input
                    v-else-if="item_1.type === 'Input.number'"
                    v-bind="item_1.props || {}"
                    v-model.number="preferenceData[item_1.field]"
                    class="!w-full"
                    :title="item_1.placeholder"
                    :placeholder="item_1.placeholder"
                    clearable
                  ></el-input>
                  <el-input
                    v-else-if="item_1.type === 'Input.path'"
                    v-bind="item_1.props || {}"
                    v-model="preferenceData[item_1.field]"
                    class="!w-full"
                    clearable
                    :placeholder="item_1.placeholder"
                    :title="item_1.placeholder"
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
                    clearable
                    :title="item_1.placeholder"
                  ></el-switch>

                  <el-select
                    v-else-if="item_1.type === 'Select'"
                    v-bind="item_1.props || {}"
                    v-model="preferenceData[item_1.field]"
                    :placeholder="item_1.placeholder"
                    class="!w-full"
                    clearable
                    :title="item_1.placeholder"
                  >
                    <el-option
                      v-for="(item_2, index_2) in item_1.options"
                      :key="index_2"
                      :label="item_2.label"
                      :value="item_2.value"
                    >
                    </el-option>
                  </el-select>
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
import { debounce } from 'lodash-es'
import { usePreferenceStore } from '@/store/index.js'
import LoadingIcon from '@/components/Device/ControlBar/LoadingIcon/index.vue'

export default {
  data() {
    const preferenceStore = usePreferenceStore()

    // console.raw('preferenceStore.data', preferenceStore.data)
    // console.raw('preferenceStore.model', preferenceStore.model)

    return {
      preferenceModel: preferenceStore.model,
      preferenceData: preferenceStore.data,
      deviceScope: preferenceStore.deviceScope,
    }
  },
  computed: {
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
    preferenceData: {
      handler() {
        this.handleSave()
      },
      deep: true,
    },
    deviceScope: {
      async handler(value) {
        if (value === 'global') {
          this.$store.preference.resetModel()
          return false
        }

        const display = await this.$adb.display(value)

        this.$store.preference.setModelParams('video', { display })
        this.preferenceModel = this.$store.preference.model
      },
      immediate: true,
    },
  },
  created() {
    this.handleSave = debounce(this.handleSave, 1000, {
      leading: false,
      trailing: true,
    })
  },
  methods: {
    handleResetAll() {
      this.$store.preference.reset(this.deviceScope)
      this.preferenceData = this.$store.preference.data
    },
    onScopeChange(value) {
      const replaceValue = this.$replaceIP(value)
      this.$store.preference.setScope(replaceValue)
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
    async handleSelect({ field }, { properties, filters } = {}) {
      try {
        const defaultPath = this.preferenceData[field]
        const files = await this.$electron.ipcRenderer.invoke(
          'show-open-dialog',
          {
            properties,
            filters,
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

      console.raw(`getSubModel.${item.field}.data`, data)

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

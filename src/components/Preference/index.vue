<template>
  <div class="">
    <div class="pb-4 pr-2 flex items-center justify-between">
      <div label="作用域范围">
        <el-select
          v-model="scopeValue"
          value-key=""
          placeholder="偏好设置的作用域范围"
          filterable
          no-data-text="暂无数据"
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
                    对全局或者单个设备设置不同的偏好配置
                  </div>
                  <div class="">
                    全局：将对所有设备生效。
                  </div>
                  <div class="">
                    单个设备：继承于全局配置，并对单个设备进行独立设置，仅对此设备生效。
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
        <el-button type="" plain @click="handleImport">
          导入配置
        </el-button>
        <el-button type="" plain @click="handleExport">
          导出配置
        </el-button>
        <el-button type="" plain @click="handleEdit">
          编辑配置
        </el-button>
        <el-button type="" plain @click="handleResetAll">
          重置配置
        </el-button>
      </div>
    </div>
    <div class="grid gap-6 pr-2">
      <el-card
        v-for="(item, index) of scrcpyModel"
        :key="index"
        shadow="hover"
        class=""
      >
        <template #header>
          <div class="flex items-center">
            <div class="flex-1 w-0 truncate pl-2 text-base">
              {{ item.label }}
            </div>
            <div class="flex-none pl-4">
              <el-button type="primary" text @click="handleReset(item.type)">
                恢复默认值
              </el-button>
            </div>
          </div>
        </template>
        <div class="">
          <el-form
            ref="elForm"
            :model="scrcpyForm"
            label-width="135px"
            class="pr-8 pt-4"
          >
            <el-row :gutter="20">
              <el-col
                v-for="(item_1, index_1) of getSubModel(item.type)"
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
                    v-if="item_1.type === 'input'"
                    v-bind="item_1.props || {}"
                    v-model="scrcpyForm[item_1.field]"
                    class="!w-full"
                    :title="item_1.placeholder"
                    :placeholder="item_1.placeholder"
                    clearable
                  ></el-input>
                  <el-input
                    v-if="item_1.type === 'input.number'"
                    v-bind="item_1.props || {}"
                    v-model.number="scrcpyForm[item_1.field]"
                    class="!w-full"
                    :title="item_1.placeholder"
                    :placeholder="item_1.placeholder"
                    clearable
                  ></el-input>
                  <el-input
                    v-if="item_1.type === 'input.path'"
                    v-bind="item_1.props || {}"
                    v-model="scrcpyForm[item_1.field]"
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
                    v-if="item_1.type === 'switch'"
                    v-bind="item_1.props || {}"
                    v-model="scrcpyForm[item_1.field]"
                    class="!w-full"
                    clearable
                    :title="item_1.placeholder"
                  ></el-switch>
                  <el-select
                    v-if="item_1.type === 'select'"
                    v-bind="item_1.props || {}"
                    v-model="scrcpyForm[item_1.field]"
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
import { useScrcpyStore } from '@/store/index.js'
import LoadingIcon from '@/components/Device/ControlBar/LoadingIcon/index.vue'

export default {
  data() {
    const scrcpyStore = useScrcpyStore()

    return {
      scrcpyModel: [
        {
          label: '自定义',
          type: 'custom',
        },
        {
          label: '视频控制',
          type: 'video',
        },
        {
          label: '设备控制',
          type: 'device',
        },
        {
          label: '窗口控制',
          type: 'window',
        },
        {
          label: '音视频录制',
          type: 'record',
        },
        {
          label: '音频控制',
          type: 'audio',
        },
      ],
      scrcpyForm: { ...scrcpyStore.config },

      scopeValue: scrcpyStore.scope,
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
        label: 'Global（全局）',
        value: 'global',
      })

      return value
    },
  },
  watch: {
    scrcpyForm: {
      handler() {
        this.handleSave()
      },
      deep: true,
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
      this.$store.scrcpy.reset(this.scopeValue)
      this.scrcpyForm = this.$store.scrcpy.config
    },
    onScopeChange(value) {
      const replaceIPValue = this.$store.device.replaceIP(value)
      this.$store.scrcpy.setScope(replaceIPValue)
      this.scrcpyForm = this.$store.scrcpy.config
    },
    async handleImport() {
      try {
        await this.$electron.ipcRenderer.invoke('show-open-dialog', {
          preset: 'replaceFile',
          filePath: this.$appStore.path,
          filters: [{ name: '请选择要导入的配置文件', extensions: ['json'] }],
        })

        this.$message.success('导入偏好配置成功')

        this.scrcpyForm = this.$store.scrcpy.init()
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }
    },
    handleEdit() {
      this.$appStore.openInEditor()
    },
    async handleExport() {
      const messageEl = this.$message({
        message: ' 正在导出偏好配置中...',
        icon: LoadingIcon,
        duration: 0,
      })

      try {
        await this.$electron.ipcRenderer.invoke('show-save-dialog', {
          defaultPath: 'escrcpy-configs.json',
          filePath: this.$appStore.path,
          filters: [
            { name: '请选择配置文件要保存的位置', extensions: ['json'] },
          ],
        })
        this.$message.success('导出偏好配置成功')
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }

      messageEl.close()
    },
    async handleSelect({ field }, { properties, filters } = {}) {
      try {
        const files = await this.$electron.ipcRenderer.invoke(
          'show-open-dialog',
          {
            properties,
            filters,
            defaultPath: this.scrcpyForm[field],
          },
        )

        const value = files[0]

        this.scrcpyForm[field] = value
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }
    },
    handleSave() {
      this.$store.scrcpy.setConfig(this.scrcpyForm)
      this.$message.success('保存配置成功，将在下一次控制设备时生效')
    },
    getSubModel(type) {
      const value = this.$store.scrcpy.getModel(type)
      return value
    },
    handleReset(type) {
      this.scrcpyForm = {
        ...this.scrcpyForm,
        ...this.$store.scrcpy.getDefaultConfig(type),
      }
      this.$store.scrcpy.setConfig(this.scrcpyForm)
    },
  },
}
</script>

<style scoped lang="postcss">
:deep(.el-card) {
  --el-card-padding: 8px;
}
</style>

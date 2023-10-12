<template>
  <div class="grid gap-6 pr-2">
    <el-card v-for="(item, index) of scrcpyModel" :key="index" shadow="hover" class="">
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
        <el-form ref="elForm" :model="scrcpyForm" label-width="125px" class="pr-8 pt-4">
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
                    <span class="">{{ item_1.label }}</span>
                  </div>
                </template>
                <el-input
                  v-if="item_1.type === 'input'"
                  v-bind="item_1.props || {}"
                  v-model="scrcpyForm[item_1.field]"
                  class="!w-full"
                  :placeholder="item_1.placeholder"
                  clearable
                ></el-input>
                <el-input
                  v-if="item_1.type === 'input.number'"
                  v-bind="item_1.props || {}"
                  v-model.number="scrcpyForm[item_1.field]"
                  class="!w-full"
                  :placeholder="item_1.placeholder"
                  clearable
                ></el-input>
                <el-input
                  v-if="item_1.type === 'input.directory'"
                  v-bind="item_1.props || {}"
                  :value="scrcpyForm[item_1.field]"
                  readonly
                  class="!w-full"
                  clearable
                  :placeholder="item_1.placeholder"
                  @click="handleDirectory(item_1)"
                ></el-input>
                <el-switch
                  v-if="item_1.type === 'switch'"
                  v-bind="item_1.props || {}"
                  v-model="scrcpyForm[item_1.field]"
                  class="!w-full"
                  :title="item_1.placeholder"
                  clearable
                ></el-switch>
                <el-select
                  v-if="item_1.type === 'select'"
                  v-bind="item_1.props || {}"
                  v-model="scrcpyForm[item_1.field]"
                  :placeholder="item_1.placeholder"
                  class="!w-full"
                  clearable
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
</template>

<script>
import { debounce } from 'lodash-es'
import { useScrcpyStore } from '@renderer/store/index.js'

export default {
  data() {
    const scrcpyStore = useScrcpyStore()

    return {
      scrcpyModel: [
        {
          label: '显示配置',
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
          label: '录制音视频',
          type: 'record',
        },
        {
          label: '音频控制',
          type: 'audio',
        },
      ],
      scrcpyForm: { ...scrcpyStore.config },
    }
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
    this.handleSave = debounce(this.handleSave, 1000, { leading: false, trailing: true })
  },
  methods: {
    async handleDirectory({ field }) {
      const res = await this.$electron.ipcRenderer.invoke('show-open-dialog', {
        properties: ['openDirectory'],
      })

      if (!res) {
        return false
      }

      const value = this.$path.normalize(res[0])

      this.scrcpyForm[field] = value
    },
    handleSave() {
      this.$store.scrcpy.updateConfig(this.scrcpyForm)
      this.$message.success('保存配置成功，将在下一次控制设备时生效')
    },
    getSubModel(type) {
      const value = this.$store.scrcpy.getModel(type)
      return value
    },
    handleReset(type) {
      this.scrcpyForm = { ...this.scrcpyForm, ...this.$store.scrcpy.getDefaultConfig(type) }
      this.$store.scrcpy.updateConfig(this.scrcpyForm)
    },
  },
}
</script>

<style scoped lang="postcss">
:deep(.el-card) {
  --el-card-padding: 8px;
}
</style>

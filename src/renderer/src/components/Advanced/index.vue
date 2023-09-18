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
        <el-form ref="elForm" :model="scrcpyForm" label-width="120px" class="pr-8 pt-4">
          <el-row :gutter="20">
            <el-col
              v-for="(item_1, index_1) of getScrcpyConfig(item.type)"
              :key="index_1"
              :span="12"
              :offset="0"
            >
              <el-form-item :label="item_1.label" :prop="item_1.field">
                <el-input
                  v-if="item_1.type === 'input'"
                  v-bind="item_1.props || {}"
                  v-model="scrcpyForm[item_1.field]"
                  class="!w-full"
                  :placeholder="item_1.placeholder"
                ></el-input>
                <el-input
                  v-if="item_1.type === 'input.number'"
                  v-bind="item_1.props || {}"
                  v-model.number="scrcpyForm[item_1.field]"
                  class="!w-full"
                  :placeholder="item_1.placeholder"
                ></el-input>
                <el-switch
                  v-if="item_1.type === 'switch'"
                  v-bind="item_1.props || {}"
                  v-model="scrcpyForm[item_1.field]"
                  class="!w-full"
                  :placeholder="item_1.placeholder"
                ></el-switch>
                <el-select
                  v-if="item_1.type === 'select'"
                  v-bind="item_1.props || {}"
                  v-model="scrcpyForm[item_1.field]"
                  :placeholder="item_1.placeholder"
                  class="!w-full"
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
import storage from '@renderer/utils/storages'
import * as scrcpyConfigs from './configs/index.js'

export default {
  emits: ['change'],
  data() {
    const scrcpyCache = storage.get('scrcpyCache') || {}
    // console.log('scrcpyCache', scrcpyCache)

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
          label: '音频控制',
          type: 'audio',
        },
        {
          label: '窗口控制',
          type: 'window',
        },
      ],
      scrcpyForm: { ...this.getDefaultValues(), ...scrcpyCache },
    }
  },
  watch: {
    scrcpyForm: {
      handler() {
        storage.set('scrcpyCache', this.scrcpyForm)
        this.$message.success('保存配置成功，将在下一次控制设备时生效')
      },
      deep: true,
    },
  },
  methods: {
    getScrcpyConfig(type) {
      const value = scrcpyConfigs[type]()
      return value
    },
    getDefaultValues(type) {
      const model = []
      if (type) {
        model.push(...this.getScrcpyConfig(type))
      }
      else {
        // console.log('scrcpyConfigs', scrcpyConfigs)
        const values = Object.values(scrcpyConfigs)
        model.push(...values.flatMap(handler => handler()))
      }

      const value = model.reduce((obj, item) => {
        const { field, value } = item
        obj[field] = value
        return obj
      }, {})

      return value
    },
    handleReset(type) {
      this.scrcpyForm = { ...this.scrcpyForm, ...this.getDefaultValues(type) }
      storage.set('scrcpyCache', this.scrcpyForm)
    },
  },
}
</script>

<style scoped lang="postcss">
:deep(.el-card) {
  --el-card-padding: 8px;
}
</style>

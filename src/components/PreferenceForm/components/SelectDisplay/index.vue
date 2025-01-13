<template>
  <el-select
    v-bind="{
      clearable: true,
      ...(data.props || {}),
    }"
    v-model="selectValue"
    class="!w-full"
    @click="getDeviceOptions"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="$t(item.label)"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { getDeviceId } from '../helper.js'

export default {
  props: {
    modelValue: {
      type: [String, Number],
      value: void 0,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    deviceScope: {
      type: String,
      value: '',
    },
    preferenceData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:model-value'],
  data() {
    return {
      deviceOptions: [],
    }
  },
  computed: {
    options() {
      return this.deviceOptions.length ? this.deviceOptions : this.data.options
    },
    selectValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:model-value', value)
      },
    },
  },
  methods: {
    async getDeviceOptions() {
      const deviceId = getDeviceId(this.deviceScope)

      if (!deviceId) {
        this.deviceOptions = []
        return false
      }

      const res = await this.$scrcpy.getDisplayIds(deviceId)

      this.deviceOptions
        = res?.map((item) => {
          return {
            label: item,
            value: item,
          }
        }) || []
    },
  },
}
</script>

<style></style>

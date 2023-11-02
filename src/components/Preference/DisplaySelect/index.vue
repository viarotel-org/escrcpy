<template>
  <el-select
    v-bind="data.props || {}"
    v-model="selectValue"
    class="!w-full"
    :title="$t(data.placeholder)"
    :placeholder="$t(data.placeholder)"
    @change="onChange"
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
export default {
  props: {
    modelValue: {
      type: String,
      value: '',
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
      selectValue: '',
    }
  },
  computed: {
    options() {
      return this.deviceOptions.length ? this.deviceOptions : this.data.options
    },
  },
  watch: {
    modelValue: {
      handler(value) {
        this.selectValue = value
      },
    },
    deviceScope: {
      handler(value) {
        if (value === 'global') {
          this.deviceOptions = []
          return
        }

        this.getDeviceOptions()
      },
    },
  },
  methods: {
    async getDeviceOptions() {
      const res = await this.$adb.display(this.deviceScope)

      this.deviceOptions
        = res?.map((item) => {
          return {
            label: item,
            value: item,
          }
        }) || []

      console.log('DisplaySelect.deviceOptions', this.deviceOptions)
    },
    onChange(value) {
      this.$emit('update:model-value', value)
    },
  },
}
</script>

<style></style>

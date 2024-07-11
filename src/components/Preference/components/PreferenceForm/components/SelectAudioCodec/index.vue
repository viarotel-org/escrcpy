<template>
  <el-select
    v-bind="{ ...(data.props || {}) }"
    v-model="selectValue"
    class="!w-full"
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
        const [decoder, encoder] = value.split(' & ')
        this.preferenceData['--audio-codec'] = decoder
        this.preferenceData['--audio-encoder'] = encoder
      },
    },
  },
  watch: {
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
      const res = await this.$scrcpy.getEncoders(this.deviceScope)

      this.deviceOptions = res?.audio?.map((item) => {
        const value = `${item.decoder} & ${item.encoder}`
        return {
          label: value,
          value,
        }
      })
    },
  },
}
</script>

<style></style>

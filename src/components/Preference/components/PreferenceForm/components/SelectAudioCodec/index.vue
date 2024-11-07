<template>
  <el-select
    v-bind="{ clearable: true, ...(data.props || {}) }"
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
        const [codec, encoder] = value.split(' & ')
        this.preferenceData['--audio-codec'] = codec
        this.preferenceData['--audio-encoder'] = encoder
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

      const res = await this.$scrcpy.getEncoders(deviceId)

      this.deviceOptions = res?.audio?.map((item) => {
        const value = `${item.codec} & ${item.encoder}`
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

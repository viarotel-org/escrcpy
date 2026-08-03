<template>
  <el-slider
    :key="`${min}-${max}`"
    v-bind="{
      min,
      max,
      step: 0.1,
      marks,
      ...(data.props || {}),
    }"
    v-model="selectValue"
    class="!w-full !ml-2"
  >
  </el-slider>
</template>

<script>
import { getDeviceId } from '../helper.js'

export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: void 0,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    deviceScope: {
      type: String,
      default: '',
    },
    preferenceData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:model-value'],
  data() {
    return {
      min: 0,
      max: 100,
    }
  },
  computed: {
    selectValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        // Suppress el-slider's initial emit when modelValue is undefined.
        // el-slider auto-clamps undefined to min, which would write a
        // spurious value into the preference store.
        if (this.modelValue === undefined && value === this.min) {
          return
        }

        this.$emit('update:model-value', value)
      },
    },
    marks() {
      const style = {
        fontSize: '10px',
        transform: 'translateY(-6px)',
      }

      return {
        [this.min]: {
          label: String(this.min),
          style,
        },
        [this.max]: {
          label: String(this.max),
          style,
        },
      }
    },
  },
  watch: {
    'preferenceData.--camera-facing': {
      handler() {
        this.getOptions()
      },
      immediate: true,
    },
  },
  methods: {
    async getOptions() {
      const deviceId = getDeviceId(this.deviceScope)

      if (!deviceId) {
        return false
      }

      const res = await this.$scrcpy.getCameraList(deviceId, { dedupe: true })

      const cameraFacing = this.preferenceData['--camera-facing'] || 'back'

      const data = res.find(item => item.facing === cameraFacing)

      const zoomRange = data?.zoomRange || [0, 100]

      this.min = zoomRange[0]
      this.max = zoomRange[1]
    },
  },
}
</script>

<style></style>

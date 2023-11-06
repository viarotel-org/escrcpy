<template>
  <el-switch
    v-bind="data.props || {}"
    v-model="switchValue"
    class="!w-full"
    :title="$t(data.placeholder)"
  ></el-switch>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      value: null,
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
  computed: {
    switchValue: {
      get() {
        return (
          this.modelValue || this.preferenceData['--video-source'] === 'camera'
        )
      },
      set(value) {
        this.preferenceData['--video-source'] = value ? 'camera' : 'display'
        this.$emit('update:model-value', value)
      },
    },
  },
}
</script>

<style></style>

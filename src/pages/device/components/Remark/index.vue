<template>
  <el-popover
    placement="bottom-start"
    :width="250"
    trigger="click"
    @show="onShow"
  >
    <template #reference>
      <el-tag effect="light" class="cursor-pointer">
        <div class="flex items-center space-x-1">
          <span class="">{{ device.remark || device.name }}</span>
          <el-icon><EditPen /></el-icon>
        </div>
      </el-tag>
    </template>

    <el-input
      ref="elInput"
      v-model="device.remark"
      class=""
      :placeholder="$t('common.input.placeholder')"
      clearable
      @change="onInputChange"
    ></el-input>
  </el-popover>
</template>

<script>
export default {
  props: {
    device: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const deviceStore = useDeviceStore()
    return {
      deviceStore,
    }
  },
  data() {
    return {}
  },
  methods: {
    async onShow() {
      this.$refs.elInput.focus()
    },

    onInputChange(value) {
      this.deviceStore.setRemark(this.device.id, value)
    },
  },
}
</script>

<style></style>

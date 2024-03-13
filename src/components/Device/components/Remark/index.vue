<template>
  <el-popover
    placement="bottom-start"
    :width="250"
    trigger="click"
    @show="onShow"
  >
    <template #reference>
      <el-tag effect="light" class="cursor-pointer">
        <div class="flex items-center">
          <el-icon>
            <EditPen />
          </el-icon>
          <span class="pl-1">{{ device.$remark || $t('device.remark') }}</span>
        </div>
      </el-tag>
    </template>

    <el-input
      ref="elInput"
      v-model="device.$remark"
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
  data() {
    return {}
  },
  methods: {
    async onShow() {
      this.$refs.elInput.focus()
    },

    onInputChange(value) {
      this.$store.device.setRemark(this.device.id, value)
    },
  },
}
</script>

<style></style>

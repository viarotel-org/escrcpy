<template>
  <el-popover
    placement="bottom-start"
    :width="250"
    trigger="hover"
    @show="handleFocus"
  >
    <template #reference>
      <el-tag effect="light" class="cursor-pointer">
        <div class="flex items-center">
          <el-icon>
            <EditPen />
          </el-icon>
          <span class="pl-1">{{
            device.$remark || $t("device.remark")
          }}</span>
        </div>
      </el-tag>
    </template>

    <el-input
      ref="elInput"
      v-model="device.$remark"
      class=""
      placeholder="请输入备注信息"
      clearable
      @change="onChange"
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
  created() {},
  methods: {
    onChange(value) {
      // console.log('onChange', value)
      this.$store.device.setRemark(this.device.id, value)
    },
    async handleFocus() {
      this.$refs.elInput.focus()
    },
  },
}
</script>

<style></style>

<template>
  <el-popover
    placement="bottom-start"
    :width="250"
    trigger="hover"
    @show="handleFocus"
  >
    <template #reference>
      <el-tag effect="light" class="ml-2 cursor-pointer">
        <div class="flex items-center">
          <el-icon>
            <EditPen />
          </el-icon>
          <span class="pl-1">{{ device.$remark || "备注" }}</span>
        </div>
      </el-tag>
    </template>

    <el-input
      ref="elInput"
      v-model="device.$remark"
      class=""
      placeholder="请输入设备备注"
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
      console.log('handleFocus')
      this.$refs.elInput.focus()
    },
  },
}
</script>

<style></style>

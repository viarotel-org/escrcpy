<!--
 * @Author: 抠脚本人
 * @QQ: 742374184
 * @Date: 2024-03-11 19:53:05
 * @LastEditTime: 2024-03-11 21:18:46
 * @Description: 
 * 灵感来之不易,积累创造奇迹
-->
<template>
  <el-popover
    placement="bottom-start"
    :width="250"
    trigger="click"
    @show="handleClick"
  >
    <template #reference>
      <el-tag effect="light" class="cursor-pointer">
        <div class="flex items-center">
          <el-icon>
            <EditPen />
          </el-icon>
          <span class="pl-1">{{ device.$remark || $t("device.remark") }}</span>
        </div>
      </el-tag>
    </template>

    <el-input
      ref="elInput"
      v-model="device.$remark"
      class=""
      :placeholder="$t('common.input.placeholder')"
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
    async handleClick() {
      this.$refs.elInput.focus()
    },
  },
}
</script>

<style></style>

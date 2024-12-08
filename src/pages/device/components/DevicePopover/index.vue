<template>
  <el-popover
    ref="popoverRef"
    placement="right"
    :width="300"
    trigger="hover"
    popper-class="!p-0 !overflow-hidden !rounded-xl"
  >
    <template #reference>
      <el-link type="primary" :underline="false" icon="InfoFilled" class="mr-1"></el-link>
    </template>

    <el-descriptions class="!w-full" border>
      <el-descriptions-item :label="$t('device.id')">
        {{ device.id }}
      </el-descriptions-item>
    </el-descriptions>
  </el-popover>
</template>

<script setup>
const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style>

</style>

<template>
  <el-progress
    v-if="state.downloading"
    type="circle"
    :width="24"
    :percentage="state.percent"
    :status="state.error && !state.downloading ? 'exception' : ''"
    :stroke-width="3"
    color="rgba(var(--color-primary-500), 1)"
    :format="(p) => `${p.toFixed(0)}%`"
    class="el-progress--mini el-progress--theme cursor-pointer !mr-2"
    @click="handleClick"
  />

  <div v-else class="relative animate-pulse !mr-1">
    <slot :trigger="handleClick" />
  </div>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

const { state, openDialog } = useAppUpdate()

function handleClick() {
  openDialog()
}
</script>

<style lang="postcss">
</style>

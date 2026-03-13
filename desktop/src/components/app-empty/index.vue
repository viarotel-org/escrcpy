<template>
  <el-result
    v-bind="{
      subTitle: subTitle || $t('common.empty'),
    }"
  >
    <template #icon>
      <slot name="title">
        <div class="i-line-md-coffee-half-empty-twotone-loop size-24 opacity-30" :class="[iconClass]"></div>
      </slot>
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title"></slot>
    </template>
    <template v-if="$slots['sub-title']" #sub-title>
      <slot name="sub-title">
      </slot>
    </template>
    <template v-if="$slots.extra" #extra>
      <slot name="extra"></slot>
    </template>
  </el-result>
</template>

<script setup>
const props = defineProps({
  iconClass: {
    type: String,
    default: '',
  },
  subTitle: {
    type: String,
    default: '',
  },
})
</script>

<style>
</style>

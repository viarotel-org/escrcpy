<template>
  <el-tooltip
    ref="tooltipRef"
    v-bind="{
      effect,
      placement,
      offset,
      content,
      ...tooltipProps,
    }"
  >
    <el-button
      v-bind="{ ...$attrs }"
      :class="[
        {
          '!border-none': borderless,
          'el-button-space-none': !$slots.default,
        },
        buttonClass,
      ]"
      @click="emit('click', $event)"
    >
      <template #icon>
        <slot name="icon"></slot>
      </template>

      <slot></slot>
    </el-button>

    <template #content>
      <slot name="content"></slot>
    </template>
  </el-tooltip>
</template>

<script setup>
defineOptions({
  name: 'ExTooltipButton',
  inheritAttrs: false,
})

const props = defineProps({
  borderless: {
    type: Boolean,
    default: false,
  },
  buttonClass: {
    type: [String, Array, Object],
    default: '',
  },
  effect: {
    type: String,
    default: 'light',
  },
  placement: {
    type: String,
    default: 'top',
  },
  offset: {
    type: Number,
    default: 1,
  },
  content: {
    type: [String, Object],
    default: '',
  },
  tooltipProps: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['click'])

const tooltipRef = ref()
watch(() => props.loading, (val) => {
  if (!val) {
    return false
  }

  tooltipRef.value?.hide?.()
})
</script>

<style lang="postcss">
.el-button.el-button-space-none {
  [class*='el-icon'] + span {
    @apply ml-0;
  }
}
</style>

<template>
  <el-tooltip v-bind="{ offset: 8, ...$attrs }">
    <ElButton
      v-bind="{ ...$props }"
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
    </ElButton>

    <template #content>
      <slot name="content"></slot>
    </template>
  </el-tooltip>
</template>

<script setup>
import { ElButton } from 'element-plus'

const props = defineProps({
  ...ElButton.props,

  borderless: {
    type: Boolean,
    default: false,
  },

  buttonClass: {
    type: [String, Array, Object],
    default: '',
  },
})

const emit = defineEmits(['click'])
</script>

<style lang="postcss">
.el-button.el-button-space-none {
  [class*='el-icon'] + span {
    @apply ml-0;
  }
}
</style>

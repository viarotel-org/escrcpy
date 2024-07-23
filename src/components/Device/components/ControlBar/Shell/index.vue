<template>
  <div class="" @click="handleClick(device)">
    <slot :loading="loading" />
  </div>
</template>

<script setup>
import { useShellAction } from '$/composables/useShellAction/index.js'

const props = defineProps({
  device: {
    type: Object,
    default: () => null,
  },
})

const { loading, invoke: handleClick } = useShellAction()
</script>

<style></style>

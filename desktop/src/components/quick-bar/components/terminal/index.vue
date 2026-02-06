<template>
  <slot :trigger="handleClick" />
</template>

<script setup>
import { nanoid } from 'nanoid'

defineOptions({
  inheritAttrs: false,
})

function handleClick() {
  window.$preload.win.open('pages/terminal', {
    type: 'local',
    instanceId: `local_terminal_${nanoid(8)}`,
  })
}
</script>

<style></style>

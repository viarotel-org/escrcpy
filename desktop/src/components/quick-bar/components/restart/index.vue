<template>
  <slot :trigger="handleClick" />
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

function handleClick() {
  window.$preload.ipcRenderer.send('restart-app')
}
</script>

<style lang="postcss"></style>

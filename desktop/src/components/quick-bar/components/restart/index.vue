<template>
  <slot :trigger="handleClick" />
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

function handleClick() {
  window.electron.ipcRenderer.send('restart-app')
}
</script>

<style lang="postcss"></style>

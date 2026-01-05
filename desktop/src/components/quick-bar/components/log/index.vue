<template>
  <slot :trigger="handleClick" />
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

function handleClick() {
  window.electron.ipcRenderer.invoke('open-log-path')
}
</script>

<style lang="postcss"></style>

<template>
  <slot :trigger="handleClick" />
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

function handleClick() {
  window.$preload.ipcRenderer.invoke('open-log-path')
}
</script>

<style lang="postcss"></style>

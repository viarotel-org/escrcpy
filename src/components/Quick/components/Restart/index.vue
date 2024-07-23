<template>
  <div class="" @click="handleClick">
    <slot />
  </div>
</template>

<script setup>
function handleClick() {
  window.electron.ipcRenderer.send('restart-app')
}
</script>

<style lang="postcss"></style>

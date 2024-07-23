<template>
  <div class="" @click="handleClick">
    <slot />
  </div>
</template>

<script setup>
function handleClick() {
  window.appLog.openInEditor()
}
</script>

<style lang="postcss"></style>

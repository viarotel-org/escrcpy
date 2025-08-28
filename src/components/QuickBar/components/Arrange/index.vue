<template>
  <div class="" @click="handleClick">
    <slot />

    <ArrangeDialog ref="arrangeDialogRef" />
  </div>
</template>

<script setup>
import ArrangeDialog from '$/components/ArrangeDialog/index.vue'

const arrangeDialogRef = ref(null)

function handleClick() {
  arrangeDialogRef.value.open()
}
</script>

<style lang="postcss"></style>

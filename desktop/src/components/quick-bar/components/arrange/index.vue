<template>
  <slot :trigger="handleClick" />

  <ArrangeDialog ref="arrangeDialogRef" />
</template>

<script setup>
import ArrangeDialog from '$/components/arrange-dialog/index.vue'

defineOptions({
  inheritAttrs: false,
})

const arrangeDialogRef = ref(null)

function handleClick() {
  arrangeDialogRef.value.open()
}
</script>

<style lang="postcss"></style>

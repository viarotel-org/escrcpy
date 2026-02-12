<template>
  <slot :trigger="handleClick" />

  <ArrangeDialog v-if="arrangeLazy.visible" ref="arrangeDialogRef" />
</template>

<script setup>
import ArrangeDialog from '$/components/arrange-dialog/index.vue'

defineOptions({
  inheritAttrs: false,
})

const arrangeDialogRef = ref(null)
const arrangeLazy = useLazy()

async function handleClick() {
  await arrangeLazy.mount()

  arrangeDialogRef.value.open({
    onClosed() {
      arrangeLazy.unmount()
    },
  })
}
</script>

<style lang="postcss"></style>

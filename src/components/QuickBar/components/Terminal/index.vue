<template>
  <div class="" @click="handleClick">
    <slot />

    <TerminalDialog ref="terminalDialog" />
  </div>
</template>

<script>
import TerminalDialog from './components/TerminalDialog/index.vue'

export default {
  components: {
    TerminalDialog,
  },
  methods: {
    handleClick() {
      this.$refs.terminalDialog.open()
    },
    invoke(...args) {
      this.$refs.terminalDialog.invoke(...args)
    },
  },
}
</script>

<style></style>

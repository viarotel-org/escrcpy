<template>
  <div class="">
    <slot :show="show" />
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
    show() {
      this.$refs.terminalDialog.show()
    },
  },
}
</script>

<style></style>

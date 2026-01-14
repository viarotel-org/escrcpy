<template>
  <slot :trigger="handleClick" />
  <TerminalDialog ref="terminalDialog" />
</template>

<script>
import TerminalDialog from './components/terminal-dialog/index.vue'

export default {
  components: {
    TerminalDialog,
  },

  inheritAttrs: false,

  methods: {
    handleClick() {
      const enableSystemTerminal = window.electronStore.get('common.enableSystemTerminal')

      if (enableSystemTerminal) {
        this.openSystemTerminal()
      }
      else {
        this.$refs.terminalDialog.open()
      }
    },
    invoke(...args) {
      const enableSystemTerminal = window.electronStore.get('common.enableSystemTerminal')

      if (enableSystemTerminal) {
        const [command] = args
        this.openSystemTerminal(command)
      }
      else {
        this.$refs.terminalDialog.invoke(...args)
      }
    },
    async openSystemTerminal(command = '') {
      try {
        await window.terminal.openSystemTerminal({
          command,
        })
      }
      catch (error) {
        console.error('Failed to open system terminal:', error)
        ElMessage.error(error.message || 'Failed to open system terminal')
      }
    },
  },
}
</script>

<style></style>

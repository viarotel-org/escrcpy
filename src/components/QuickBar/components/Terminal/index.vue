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
      const enableSystemTerminal = window.appStore.get('common.enableSystemTerminal')

      if (enableSystemTerminal) {
        this.openSystemTerminal()
      }
      else {
        this.$refs.terminalDialog.open()
      }
    },
    invoke(...args) {
      const enableSystemTerminal = window.appStore.get('common.enableSystemTerminal')

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

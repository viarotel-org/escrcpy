<template>
  <slot :trigger="handleClick" />
  <TerminalDialog ref="terminalDialog" />
</template>

<script>
import { nanoid } from 'nanoid'
import TerminalDialog from './components/terminal-dialog/index.vue'

export default {
  components: {
    TerminalDialog,
  },

  inheritAttrs: false,

  methods: {
    handleClick() {
      window.$preload.win.open('pages/terminal', {
        type: 'local',
        instanceId: `local_terminal_${nanoid(8)}`,
      })
    },
    invoke(...args) {
      const enableSystemTerminal = window.$preload.store.get('common.enableSystemTerminal')

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
        await window.$preload.terminal.openSystemTerminal({
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

<template>
  <div class="">
    <el-button plain @click="handleShow">
      <template #icon>
        <svg-icon name="command"></svg-icon>
      </template>
      {{ $t('device.terminal.name') }}
    </el-button>

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
    handleShow() {
      this.$refs.terminalDialog.show()
    },
    invoke(...args) {
      this.$refs.terminalDialog.invoke(...args)
    },
  },
}
</script>

<style></style>

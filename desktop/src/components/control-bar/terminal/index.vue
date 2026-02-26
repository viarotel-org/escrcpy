<template>
  <el-dropdown :disabled="floating || ['unauthorized', 'offline'].includes(device.status)" @command="handleCommand">
    <slot :loading :trigger="handleTrigger" />

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, index) of options"
          :key="index"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { nanoid } from 'nanoid'

const props = defineProps({
  device: {
    type: Object,
    default: () => ({}),
  },
  floating: {
    type: Boolean,
    default: false,
  },
})

const { loading, invoke: handleScript } = useShellAction()

const options = computed(() => {
  return [
    {
      label: window.t('terminal.command.name'),
      value: 'command',
    },
    {
      label: window.t('terminal.script.name'),
      value: 'script',
    },
  ]
})

function handleCommand(val) {
  const device = toRaw(props.device ?? {})

  switch (val) {
    case 'command':
      window.$preload.win.open('pages/terminal', {
        title: 'terminal.command.name',
        type: 'device',
        device,
        instanceId: device.id,
      })
      break
    case 'script':
      handleScript(device)
      break
  }
}

function handleTrigger() {
  if (!props.floating) {
    return false
  }

  openSystemMenu({
    options: options.value,
  })
}

function openSystemMenu(params = {}) {
  const channel = `control-bar:${nanoid(8)}`

  window.$preload.ipcRenderer.once(
    channel,
    (event, data) => {
      handleCommand(data)
    },
  )

  const options = toRaw(params.options)

  window.$preload.ipcRenderer.invoke('open-system-menu', {
    channel,
    options,
  })
}
</script>

<style></style>

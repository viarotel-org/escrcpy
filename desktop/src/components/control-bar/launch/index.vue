<template>
  <AppSelector
    ref="appSelectorRef"
    :device-id="device.id"
    :disabled="floating"
    with-home
    show-actions
    @mouseenter="onMouseEnter"
    @change="(pkg, item) => onStartApp(item)"
  >
    <template #default>
      <slot :trigger="handleTrigger" />
    </template>

    <template #actions="{ item }">
      <el-link
        v-if="['win32'].includes(platform)"
        type="primary"
        underline="never"
        icon="TopRight"
        :title="$t('desktop.shortcut.add')"
        @click.stop="onShortcutClick(item)"
      />
      <el-link
        type="primary"
        underline="never"
        icon="Monitor"
        :title="$t('device.control.launch.useMainScreen')"
        @click.stop="onMainStartClick(item)"
      />
    </template>
  </AppSelector>
</template>

<script setup>
import { openFloatControl } from '$/utils/device/index.js'
import { useStartApp } from '$/hooks/useStartApp/index.js'
import AppSelector from '$/components/app-selector/index.vue'

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

const startApp = useStartApp()
const deviceStore = useDeviceStore()
const platform = window.$preload.process?.platform

const appSelectorRef = ref(null)

function onMouseEnter() {
  if (!['device'].includes(props.device.status)) {
    return
  }

  appSelectorRef.value?.loadAppList()
}

function handleTrigger() {
  if (!props.floating)
    return false

  const channel = 'startApp'

  window.$preload.ipcRenderer.once(channel, (event, value, item) => {
    onStartApp(item)
  })

  const options = toRaw(appSelectorRef.value?.appList || []).map(item => ({
    ...item,
    label: `${item.name}[${item.packageName}]`,
    value: item.packageName,
  }))

  window.$preload.ipcRenderer.invoke('open-system-menu', { channel, options })
}

function onStartApp({ label, value }) {
  startApp.open({
    deviceId: props.device.id,
    appName: label,
    packageName: value,
  })
  openFloatControl(toRaw(props.device))
}

function onMainStartClick({ label, value }) {
  startApp.open({
    deviceId: props.device.id,
    appName: label,
    packageName: value,
    useNewDisplay: false,
  })
  openFloatControl(toRaw(props.device))
}

function onShortcutClick(item) {
  const desktopName = deviceStore.getLabel(props.device, ({ deviceName }) => `${item.label}-${deviceName}`)

  let shortcutArguments = `--device-id=${props.device.id} --app-name=${item.label}`

  if (item.value) {
    shortcutArguments += ` --package-name=${item.value}`
  }

  const result = window.$preload.desktop.createShortcuts({
    name: desktopName,
    comment: desktopName,
    arguments: shortcutArguments,
  })

  if (result) {
    ElMessage.success(window.t('common.success'))
    return
  }
  ElMessage.warning(window.t('common.failed'))
}
</script>

<style></style>

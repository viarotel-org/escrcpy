<template>
  <AppSelector
    ref="appSelectorRef"
    :device-id="device.id"
    :disabled="floating"
    with-home
    with-secondary
    label-class="pr-32"
    @change="(pkg, item) => onStartApp(item)"
    @visible-change="onVisibleChange"
  >
    <template #default>
      <slot :trigger="handleTrigger" />
    </template>

    <template #actions="{ item }">
      <el-switch
        v-model="launchOrientation.selections[getLaunchKey(item)]"
        class="el-switch--theme mr-[5px]"
        plain
        size="small"
        :title="getOrientationToggleTitle(item)"
        @click.stop
        @mousedown.stop
        @pointerdown.stop
        @change="value => launchOrientation.setEnabled(item, value)"
      >
        <template #active-action>
          <div class="i-fluent-rectangle-landscape-12-regular size-full"></div>
        </template>
        <template #inactive-action>
          <div class="i-fluent-rectangle-portrait-12-regular text-primary-500 size-full"></div>
        </template>
      </el-switch>
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
import { quote } from 'shell-quote'
import { openFloatControl } from '$/utils/device/index.js'
import { useStartApp } from '$/hooks/useStartApp/index.js'
import { useLaunchOrientation } from '$/hooks/useLaunchOrientation/index.js'
import AppSelector from '$/components/app-selector/index.vue'
import { getLaunchKey, getPackageName } from '$/utils/launch/index.js'

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
const launchOrientation = useLaunchOrientation({
  lazy: true,
  getDeviceId: () => props.device.id,
})

function getStartAppOptions(item = {}, extraOptions = {}) {
  const { label, userId, activity } = item

  const packageName = getPackageName(item)

  return {
    deviceId: props.device.id,
    appName: label,
    packageName,
    userId,
    activity,
    landscape: launchOrientation.isEnabled(item),
    ...extraOptions,
  }
}

function getOrientationToggleTitle(item = {}) {
  const title = launchOrientation.isEnabled(item)
    ? window.t('device.control.rotation.horizontally')
    : window.t('device.control.rotation.vertically')

  return `${window.t('device.control.rotation.name')}: ${title}`
}

function handleTrigger() {
  if (!props.floating) {
    return false
  }

  const channel = 'startApp'

  window.$preload.ipcRenderer.once(channel, (event, value, item) => {
    onStartApp(item)
  })

  const options = toRaw(appSelectorRef.value?.appList || []).map(item => ({
    ...item,
    label: item.label || `${item.name}[${item.packageName}]`,
    value: item.value ?? item.packageName,
  }))

  window.$preload.ipcRenderer.invoke('open-system-menu', { channel, options })
}

function onStartApp(item = {}) {
  startApp.open(getStartAppOptions(item))
  openFloatControl(toRaw(props.device))
}

function onMainStartClick(item = {}) {
  startApp.open(getStartAppOptions(item, { useNewDisplay: false }))
  openFloatControl(toRaw(props.device))
}

function quoteShortcutArgument(value = '') {
  return quote([String(value)])
}

function stringifyShortcutArguments(args = {}) {
  return Object.entries(args)
    .filter(([, value]) => ![undefined, null, ''].includes(value))
    .map(([key, value]) => `--${key}=${quoteShortcutArgument(value)}`)
    .join(' ')
}

function onShortcutClick(item) {
  const startOptions = getStartAppOptions(item)
  const landscape = startOptions.landscape
  const desktopName = deviceStore.getLabel(
    props.device,
    ({ deviceName }) => `${item.label}${landscape ? '-landscape' : ''}-${deviceName}`,
  )

  const shortcutArguments = stringifyShortcutArguments({
    'device-id': startOptions.deviceId,
    'app-name': startOptions.appName,
    'package-name': startOptions.packageName,
    'user-id': startOptions.userId,
    'activity': startOptions.activity,
    'landscape': landscape ? 1 : '',
  })

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

function onVisibleChange(visible) {
  if (!visible) {
    return false
  }

  launchOrientation.init()
}
</script>

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
      <div class="launch-landscape-checkbox" @click.stop @mousedown.stop>
        <el-checkbox
          :model-value="isLandscapeEnabled(item)"
          :title="$t('device.control.rotation.horizontally')"
          :aria-label="$t('device.control.rotation.horizontally')"
          @change="value => onLandscapeChange(item, value)"
        />
      </div>
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
const landscapeSelections = reactive({})

function getLandscapeItemKey(item = {}) {
  const userId = item.userId ?? 0
  const packageName = item.packageName || item.value || 'unknown'

  return `${userId}__${packageName}`.replace(/[^\w-]/g, '_')
}

function getLandscapeStoreKey(item) {
  return `launch.landscape.${props.device.id}.${getLandscapeItemKey(item)}`
}

function isLandscapeEnabled(item) {
  const key = getLandscapeItemKey(item)

  if (typeof landscapeSelections[key] !== 'undefined') {
    return Boolean(landscapeSelections[key])
  }

  return Boolean(window.$preload.store.get(getLandscapeStoreKey(item)))
}

function onLandscapeChange(item, value) {
  const enabled = Boolean(value)
  const key = getLandscapeItemKey(item)

  landscapeSelections[key] = enabled
  window.$preload.store.set(getLandscapeStoreKey(item), enabled)
}

function getStartAppOptions(item = {}, extraOptions = {}) {
  const { label, value, packageName = value, userId, activity } = item

  return {
    deviceId: props.device.id,
    appName: label,
    packageName,
    userId,
    activity,
    landscape: isLandscapeEnabled(item),
    ...extraOptions,
  }
}

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
    label: item.label || `${item.name}[${item.packageName}]`,
    value: item.value ?? item.packageName,
  }))

  window.$preload.ipcRenderer.invoke('open-system-menu', { channel, options })
}

function onStartApp({ label, value, packageName = value, userId, activity }) {
  startApp.open(getStartAppOptions({ label, value, packageName, userId, activity }))
  openFloatControl(toRaw(props.device))
}

function onMainStartClick({ label, value, packageName = value, userId, activity }) {
  startApp.open(getStartAppOptions(
    { label, value, packageName, userId, activity },
    { useNewDisplay: false },
  ))
  openFloatControl(toRaw(props.device))
}

function onShortcutClick(item) {
  const landscape = isLandscapeEnabled(item)
  const desktopName = deviceStore.getLabel(
    props.device,
    ({ deviceName }) => `${item.label}${landscape ? '-landscape' : ''}-${deviceName}`,
  )

  let shortcutArguments = `--device-id=${props.device.id} --app-name=${item.label}`

  if (item.packageName) {
    shortcutArguments += ` --package-name=${item.packageName}`
  }

  if (item.userId) {
    shortcutArguments += ` --user-id=${item.userId}`
  }

  if (item.activity) {
    shortcutArguments += ` --activity=${item.activity}`
  }

  if (landscape) {
    shortcutArguments += ' --landscape=1'
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

<style scoped>
.launch-landscape-checkbox {
  display: flex;
  align-items: center;
  margin-right: 2px;
}

.launch-landscape-checkbox :deep(.el-checkbox) {
  margin-right: 0;
}
</style>

<template>
  <el-config-provider :locale="locale">
    <div
      class="flex items-center bg-primary-100 dark:bg-gray-800 absolute inset-0 h-full"
    >
      <div class="flex-none h-full">
        <el-button
          type="primary"
          class="!px-3 bg-transparent !border-none !h-full"
          plain
          @click="handleClose"
        >
          <el-icon class="">
            <ElIconCircleCloseFilled />
          </el-icon>
        </el-button>
      </div>

      <div
        class="h-4 w-px mx-1 bg-primary-200 dark:bg-primary-800 flex-none"
      ></div>

      <div class="flex-none h-full">
        <el-button
          type="primary"
          text
          class="!px-2 !h-full"
          icon="ArrowDown"
          @click="switchDevice"
        >
          <span class="mr-2">{{ deviceName }}</span>
        </el-button>
      </div>

      <div
        class="h-4 w-px mx-1 bg-primary-200 dark:bg-primary-800 flex-none"
      ></div>

      <div class="flex-1 w-0 overflow-hidden h-full">
        <ControlBar class="!h-full" :device="deviceInfo" floating />
      </div>

      <div
        class="h-4 w-px mx-1 bg-primary-200 dark:bg-primary-800 flex-none"
      ></div>

      <div class="flex-none h-full app-region-drag">
        <el-button type="primary" text class="!px-3 !h-full">
          <el-icon class="">
            <ElIconRank />
          </el-icon>
        </el-button>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import ControlBar from '$/components/Device/components/ControlBar/index.vue'

import { i18n } from '$/locales/index.js'

import localeModel from '$/plugins/element-plus/locale.js'

import { useDeviceStore, useThemeStore } from '$/store/index.js'

const themeStore = useThemeStore()
const deviceStore = useDeviceStore()

const locale = computed(() => {
  const i18nLocale = i18n.global.locale.value

  const value = localeModel[i18nLocale]

  return value
})

const deviceInfo = ref({})

const deviceList = ref([])

const deviceName = computed(() => deviceStore.getLabel(deviceInfo.value, ({ deviceName }) => deviceName))

function handleClose() {
  window.electron.ipcRenderer.send('hide-active-window')
}

async function switchDevice(e) {
  e.preventDefault()

  const data = await deviceStore.getList()

  const options = data.map((item) => {
    return {
      label: deviceStore.getLabel(item, ({ deviceName }) => deviceName),
      value: item,
    }
  })

  window.electron.ipcRenderer.send('open-system-menu', {
    channel: 'device-change',
    options,
  })
}

onMounted(() => {
  window.electron.ipcRenderer.send('control-mounted')

  themeStore.init()

  window.electron.ipcRenderer.on('device-change', (event, data) => {
    deviceInfo.value = data
  })

  window.electron.ipcRenderer.on('language-change', (event, data) => {
    i18n.global.locale.value = data
  })

  window.electron.ipcRenderer.on('theme-change', (event, data) => {
    themeStore.update(data)
  })
})
</script>

<style lang="postcss">
.app-region-drag {
  -webkit-app-region: drag;
}
</style>

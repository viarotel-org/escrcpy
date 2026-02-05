<template>
  <el-config-provider :locale="locale">
    <div
      class="flex items-center bg-primary-100 dark:bg-gray-800 absolute inset-0 h-full rounded-md overflow-hidden transition-opacity"
      :class="focusFlag ? 'opacity-100' : 'opacity-50'"
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
        <ControlBar class="!h-full" :device="currentDevice" floating />
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
import ControlBar from '$/components/control-bar/index.vue'

const deviceStore = useDeviceStore()

const { currentDevice, locale } = useWindowStateSync({
  deviceSync: true,
})

const deviceName = computed(() => deviceStore.getLabel(currentDevice.value, ({ deviceName }) => deviceName))

function handleClose() {
  window.$preload.win.close('pages/control')
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

  window.$preload.ipcRenderer.invoke('open-system-menu', {
    channel: 'device-change',
    options,
  })
}

const focusFlag = ref(true)

window.$preload.ipcRenderer.on('window-focus', (event, value) => {
  focusFlag.value = value
})
</script>

<style lang="postcss">
.app-region-drag {
  -webkit-app-region: drag;
}

html,
body {
  background-color: transparent;
}
</style>

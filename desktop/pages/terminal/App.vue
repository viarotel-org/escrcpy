<template>
  <el-config-provider :locale="locale" :size="size">
    <div class="flex flex-col h-screen">
      <AppHeader
        :title="terminalTitle"
        :device-name="currentDeviceLabel"
        class="px-2"
      >
        <template #right>
          <div class="flex items-center !space-x-2 *:app-region-no-drag">
            <el-button
              circle
              text
              icon="Refresh"
              :title="$t('device.refresh.name')"
              @click="onRefreshClick"
            />
            <el-switch v-model="isDark" class="el-switch--theme">
              <template #active-action>
                <i class="i-solar-moon-bold"></i>
              </template>
              <template #inactive-action>
                <i class="i-solar-sun-bold"></i>
              </template>
            </el-switch>
          </div>
        </template>
      </AppHeader>

      <div class="flex-1 min-h-0 overflow-hidden relative group px-2 py-2">
        <div
          ref="terminalRef"
          class="xterm-wrapper size-full"
        ></div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import AppHeader from '$/components/app-header/index.vue'
import { useTerminal } from './hooks/useTerminal/index'

const deviceStore = useDeviceStore()
const { currentDevice, locale, size, themeStore } = useWindowStateSync()

const currentDeviceLabel = computed(() => {
  const device = currentDevice.value
  return device?.id ? deviceStore.getLabel(device, 'name') : ''
})

const terminalTitle = ref(window.$preload.payload.title || 'Escrcpy Terminal')

const isDark = computed({
  get: () => themeStore.isDark,
  set: (v) => {
    themeStore.isDark = v
    themeStore.updateHtml(v ? 'dark' : 'light')
  },
})

const { terminalRef, terminalConfig } = useTerminal({
  theme: 'github',
})

function onRefreshClick() {
  window.location.reload()
}
</script>

<style lang="postcss" scoped>
:deep() {
  .xterm {
    .xterm-viewport,
    .xterm-scrollable-element {
      @apply !bg-transparent;
    }

    .xterm-scrollable-element .scrollbar.vertical {
      &,
      & .slider {
        @apply !w-[7px] !rounded-full;
      }
    }

    .xterm-scrollable-element .scrollbar.horizontal {
      &,
      & .slider {
        @apply !h-[7px] !rounded-full;
      }
    }
  }
}
</style>

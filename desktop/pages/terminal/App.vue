<template>
  <el-config-provider :locale="locale" :size="size">
    <div class="flex flex-col h-screen">
      <div
        :class="[
          {
            'pl-20': $platform.is('macos'),
            'pr-[calc(100px+3.6vw)]': $platform.is('windows') || $platform.is('linux'),
          },
        ]"
        class="app-region-drag flex-none flex items-center justify-between px-2 py-2"
      >
        <div class="flex items-center gap-4">
          <div class="text-sm font-semibold pl-2 select-none">
            Escrcpy Terminal
          </div>

          <el-tag v-if="['device'].includes(terminalConfig.type)" type="primary">
            <div class="flex items-center gap-2">
              <div class="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              {{ currentDeviceLabel }}
            </div>
          </el-tag>
        </div>

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
      </div>

      <div class="flex-1 min-h-0 overflow-hidden relative group pl-4 pr-2 py-2">
        <div
          ref="terminalRef"
          class="xterm-wrapper size-full"
        ></div>
      </div>
    </div>

    <WindowControls v-if="$platform.is('windows') || $platform.is('linux')" />
  </el-config-provider>
</template>

<script setup>
import WindowControls from '$/components/window-controls/index.vue'
import { useTerminal } from './hooks/useTerminal/index'

const deviceStore = useDeviceStore()
const { currentDevice, locale, size, themeStore } = useWindowStateSync()

const currentDeviceLabel = computed(() => {
  const device = currentDevice.value
  return device?.id ? deviceStore.getLabel(device, 'name') : 'Device Terminal'
})

const isDark = computed({
  get: () => themeStore.isDark,
  set: (v) => {
    themeStore.isDark = v
    themeStore.updateHtml(v ? 'dark' : 'light')
  },
})

const { terminalRef, terminalConfig } = useTerminal({
  theme: 'github',
  preload: window.$preload,
})

function onRefreshClick() {
  window.location.reload()
}
</script>

<style lang="postcss" scoped>
.xterm-wrapper {
  --scrollbar-width: 5px;
  --scrollbar-track: transparent;
  --scrollbar-thumb: rgba(0, 0, 0, 0.2);
  --scrollbar-thumb-hover: rgba(0, 0, 0, 0.4);
}

:deep(.dark .xterm-wrapper) {
  --scrollbar-thumb: rgba(255, 255, 255, 0.2);
  --scrollbar-thumb-hover: rgba(255, 255, 255, 0.4);
}

:deep() {
  .xterm {
    font-feature-settings: 'liga' 0;
    padding: 0;
  }

  .xterm-viewport,
  .xterm-scrollable-element {
    background-color: transparent !important;
  }

  .xterm-viewport {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
    &::-webkit-scrollbar {
      width: var(--scrollbar-width);
      background-color: var(--scrollbar-track);
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-thumb);
      border-radius: 6px;
      border: 2px solid transparent;
      background-clip: content-box;
      transition: background-color 0.2s;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: var(--scrollbar-thumb-hover);
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
}
</style>

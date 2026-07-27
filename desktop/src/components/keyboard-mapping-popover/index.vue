<template>
  <div class="h-full overflow-hidden rounded-r-lg border border-white/15 bg-[#1c1e20] text-gray-100 shadow-2xl" @mouseenter="keepOpen" @mouseleave="hide">
    <button
      v-for="profile in mappingStore.config.profiles"
      :key="profile.id"
      class="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-white/8"
      :class="profile.id === mappingStore.config.activeProfileId ? 'text-emerald-400' : ''"
      @click="selectProfile(profile.id)"
    >
      <i class="i-carbon-document text-base"></i>
      <span class="truncate">{{ profile.name }}</span>
    </button>
    <div class="border-t border-white/12"></div>
    <button class="flex w-full items-center gap-2 bg-emerald-950/50 px-4 py-3 text-left text-emerald-400 hover:bg-emerald-900/50" @click="openEditor">
      <i class="i-carbon-edit text-base"></i>
      方案配置
    </button>
  </div>
</template>

<script setup>
const mappingStore = useKeyboardMappingStore()
const device = window.$preload.payload?.device
const initialConfig = window.$preload.payload?.config

if (initialConfig)
  mappingStore.replaceConfig(initialConfig)
else if (device?.id)
  mappingStore.load(device.id)

const removeReloadListener = window.$preload.ipcRenderer.on(
  'keyboard-mapping:reload-popover',
  (_event, payload = {}) => {
    if (payload.config)
      mappingStore.replaceConfig(payload.config)
    else
      mappingStore.load(payload.deviceId || device?.id)
  },
)

function keepOpen() {
  window.$preload.ipcRenderer.invoke('control:keep-mapping-popover')
}

function hide() {
  window.$preload.ipcRenderer.invoke('control:hide-mapping-popover')
}

function selectProfile(id) {
  mappingStore.selectProfile(id)
  mappingStore.setEnabled(true)
  window.$preload.ipcRenderer.invoke('control:select-mapping-profile', { id })
  window.$preload.ipcRenderer.invoke('control:hide-mapping-popover', { immediate: true })
}

async function openEditor() {
  await window.$preload.ipcRenderer.invoke('control:open-mapping-editor')
}

onBeforeUnmount(() => removeReloadListener?.())
</script>

<template>
  <div class="flex items-center fixed !space-x-2 top-[2px] right-2 z-9999 *:app-region-no-drag">
    <el-button text plain circle class="!hover:bg-gray-200 !active:bg-gray-300 !hover:dark:bg-gray-800 !active:dark:bg-gray-700" @click="onMinimizeClick">
      <template #icon>
        <i class="i-ph-minus"></i>
      </template>
    </el-button>
    <el-button text plain circle class="!hover:bg-gray-200 !active:bg-gray-300 !hover:dark:bg-gray-800 !active:dark:bg-gray-700" @click="onMaximizeClick">
      <template #icon>
        <i v-if="maximized" class="i-ph-copy-simple"></i>
        <i v-else class="i-ph-square"></i>
      </template>
    </el-button>
    <el-button text plain circle class="!hover:text-white !hover:bg-red-500 !active:bg-red-400" @click="onCloseClick">
      <template #icon>
        <i class="i-ph-x"></i>
      </template>
    </el-button>
  </div>
</template>

<script setup>
const maximized = ref(false)

let disposeWindowMaximizeSubscribe = null

onMounted(async () => {
  const { dispose } = await window.electron.ipcxRenderer.invokeRetained(
    'window-is-maximized',
    (isMaximized) => {
      maximized.value = isMaximized
    })

  disposeWindowMaximizeSubscribe = dispose
})

onBeforeUnmount(() => {
  disposeWindowMaximizeSubscribe?.()
})

function onMinimizeClick() {
  window.electron.ipcRenderer.invoke('window-minimize')
}

function onMaximizeClick() {
  window.electron.ipcRenderer.invoke('window-maximize')
}

function onCloseClick() {
  window.electron.ipcRenderer.invoke('window-close')
}
</script>

<style>
</style>

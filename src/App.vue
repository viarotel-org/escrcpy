<template>
  <el-config-provider :locale :size="getSize($grid)">
    <Layouts />
  </el-config-provider>
</template>

<script setup>
import { ElLoading, ElMessageBox } from 'element-plus'

import { i18n } from '$/locales/index.js'
import localeModel from '$/plugins/element-plus/locale.js'

import { usePreferenceStore } from '$/store/preference/index.js'
import { useThemeStore } from '$/store/theme/index.js'

import { useStartApp } from '$/composables/index.js'

import Layouts from './layouts/index.vue'

window.electron.ipcRenderer.on('quit-before', async () => {
  ElLoading.service({
    lock: true,
    text: window.t('appClose.quit.loading'),
  })
})

const startApp = useStartApp()

window.electron.ipcRenderer.on('execute-arguments-change', async (event, params) => {
  startApp.open(params)
})

onMounted(() => {
  startApp.open()
})

const locale = computed(() => {
  const i18nLocale = i18n.global.locale.value

  const value = localeModel[i18nLocale]

  return value
})

const themeStore = useThemeStore()
const preferenceStore = usePreferenceStore()

themeStore.init()
preferenceStore.init()

showTips()

function getSize(grid) {
  const value = ['sm', 'md'].includes(grid.breakpoint) ? 'small' : 'default'

  return value
}

async function showTips() {
  const { scrcpyPath } = window.electron?.configs || {}

  if (scrcpyPath) {
    return false
  }

  ElMessageBox.alert(
    `<div>
      ${window.t('dependencies.lack.content', {
        name: '<a class="hover:underline text-primary-500" href="https://github.com/Genymobile/scrcpy" target="_blank">scrcpy</a>',
      })}
    <div>`,
    window.t('dependencies.lack.title'),
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: window.t('common.confirm'),
    },
  )
}
</script>

<style lang="postcss">
/* Titlebar drag region styles */
.app-region-drag {
  -webkit-app-region: drag;
}

.app-region-no-drag {
  -webkit-app-region: no-drag;
}

html, body {
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

/* Add global styles for the titlebar */
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Import the titlebar specific styles */
@import '$/styles/css/titlebar.css';
</style>
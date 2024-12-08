<template>
  <el-config-provider :locale :size="getSize($grid)">
    <Layouts />
  </el-config-provider>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'

import { i18n } from '$/locales/index.js'
import localeModel from '$/plugins/element-plus/locale.js'

import { usePreferenceStore } from '$/store/preference/index.js'
import { useThemeStore } from '$/store/theme/index.js'

import Layouts from './layouts/index.vue'

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

<style lang="postcss" scoped>
</style>

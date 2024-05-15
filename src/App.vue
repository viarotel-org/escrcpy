<template>
  <div class="absolute inset-0 px-4 pb-4 h-full">
    <el-tabs
      v-model="activeTab"
      class="el-tabs-flex"
      addable
      @tab-change="onTabChange"
    >
      <template #add-icon>
        <AppSearch />
      </template>
      <el-tab-pane
        v-for="(item, index) of tabsModel"
        :key="index"
        :label="$t(item.label)"
        :name="item.prop"
        lazy
      >
        <component
          :is="item.component"
          v-if="isRender(item)"
          :ref="item.prop"
          :re-render="reRender"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'

import Device from './components/Device/index.vue'
import Preference from './components/Preference/index.vue'
import About from './components/About/index.vue'
import AppSearch from './components/AppSearch/index.vue'

import { useThemeStore } from '$/store/theme/index.js'
import { usePreferenceStore } from '$/store/preference/index.js'

const tabsModel = ref([
  {
    label: 'device.list',
    prop: 'Device',
    component: markRaw(Device),
  },
  {
    label: 'preferences.name',
    prop: 'Preference',
    component: markRaw(Preference),
  },
  {
    label: 'about.name',
    prop: 'About',
    component: markRaw(About),
  },
])

const activeTab = ref('Device')
provide('activeTab', activeTab)

const renderTab = ref('')
const rendered = ref(true)
const renderSign = ref(false)

const themeStore = useThemeStore()
const preferenceStore = usePreferenceStore()

themeStore.init()
preferenceStore.init()

showTips()

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

function isRender(item) {
  if (renderTab.value === item.prop) {
    return rendered.value
  }

  return true
}

async function reRender(other) {
  renderTab.value = other || activeTab.value

  rendered.value = false
  await nextTick()
  rendered.value = true

  renderTab.value = ''
}

function reRenderPost() {
  renderSign.value = true
}

async function onTabChange(prop) {
  if (!renderSign.value) {
    return false
  }

  if (['Device', 'Preference'].includes(prop)) {
    reRender()
  }

  renderSign.value = false
}

defineExpose({
  reRenderPost,
  reRender,
})
</script>

<style lang="postcss" scoped>
:deep() {
  .el-tabs__header {
    @apply !mb-3;
  }
  .el-tabs__new-tab {
    @apply !absolute !inset-y-0 !right-0 !border-none;
  }

  .el-tabs__nav-wrap:after {
    @apply !h-px;
  }
}
</style>

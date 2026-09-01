<template>
  <div class="flex items-center relative z-10 *:app-region-no-drag -mr-1">
    <component
      :is="item.component || 'div'"
      v-for="item in actionModel"
      :key="item.label"
      class="flex-none"
      v-bind="{
        ...(item.command
          ? {
            onClick: () => handleCommand(item),
          }
          : {}),
      }"
    >
      <template #default="{ trigger, ...slotProps } = {}">
        <el-button
          v-bind="{
            title: $t(item.tips || item.label),
            circle: true,
            borderless: true,
            text: true,
            ...item.buttonProps,
            ...slotProps,
            ...(trigger ? { onClick: trigger } : {}),
          }"
          class="!mx-1"
        >
          <template #icon>
            <el-icon v-if="item.elIcon" :class="item.iconClass">
              <component :is="item.elIcon" />
            </el-icon>
            <i v-else-if="item.fontIcon" :class="[item.fontIcon, item.iconClass]"></i>
          </template>
        </el-button>
      </template>
    </component>
  </div>
</template>

<script setup>
import Arrange from './components/arrange/index.vue'
import Log from './components/log/index.vue'
import Restart from './components/restart/index.vue'
import Search from './components/search/index.vue'
import Terminal from './components/terminal/index.vue'
import Update from './components/update/index.vue'

const props = defineProps({})

const preferenceStore = usePreferenceStore()

const { state, checkForUpdate } = useAppUpdate()

const actionModel = computed(() => {
  const items = [
    {
      label: 'device.arrange.name',
      fontIcon: 'i-bi-window-split',
      component: Arrange,
    },
    {
      label: 'device.terminal.name',
      fontIcon: 'i-bi-terminal',
      component: Terminal,
    },
    {
      label: 'device.log.name',
      fontIcon: 'i-qlementine-icons-run-debug-16',
      component: Log,
    },
    {
      label: 'device.restart.name',
      fontIcon: 'i-iconoir-refresh',
      component: Restart,
    },
    {
      label: 'common.search',
      fontIcon: 'i-bi-search',
      component: Search,
    },
  ]

  if (state.updateAvailable) {
    items.unshift({
      label: 'update.new-version',
      tips: 'update.title',
      fontIcon: 'i-bi-cloud-download-fill',
      buttonProps: {
        type: 'primary',
        plain: true,
        text: false,
      },
      component: Update,
    })
  }

  return items
})

onMounted(() => {
  if (preferenceStore.data.autoCheckUpdate) {
    checkForUpdate({ silent: true })
  }
})

function handleCommand() {}
</script>

<style></style>

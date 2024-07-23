<template>
  <div class="flex items-center space-x-4 relative z-10">
    <component
      :is="item.component || 'div'"
      v-for="(item, index) in actionModel"
      :key="index"
      class="flex-none"
      v-bind="{
        ...(item.command
          ? {
            onClick: () => handleCommand(item),
          }
          : {}),
      }"
    >
      <template #default="{ loading = false } = {}">
        <el-button
          circle
          size="small"
          :title="$t(item.tips || item.label)"
          :loading="loading"
        >
          <template #icon>
            <svg-icon
              v-if="item.svgIcon"
              :name="item.svgIcon"
              :class="item.iconClass"
            ></svg-icon>
            <el-icon v-else-if="item.elIcon" :class="item.iconClass">
              <component :is="item.elIcon" />
            </el-icon>
          </template>
        </el-button>
      </template>
    </component>
  </div>
</template>

<script setup>
import Search from './components/Search/index.vue'
import Restart from './components/Restart/index.vue'
import Log from './components/Log/index.vue'
import Terminal from './components/Terminal/index.vue'

const props = defineProps({})

const actionModel = [
  {
    label: 'device.terminal.name',
    svgIcon: 'command',
    component: Terminal,
  },
  {
    label: 'device.log.name',
    elIcon: 'View',
    component: Log,
  },
  {
    label: 'device.restart.name',
    elIcon: 'RefreshRight',
    component: Restart,
  },
  {
    label: 'common.search',
    elIcon: 'Search',
    component: Search,
  },
]

function handleCommand() {}
</script>

<style></style>

<template>
  <div class="flex items-center space-x-4 relative z-10 *:app-region-no-drag">
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
        <ExTooltipButton
          v-bind="{
            type: 'default',
            content: $t(item.tips || item.label),
            circle: true,
            borderless: true,
            text: true,
            size: 'small',
            effect: 'light',
            ...slotProps,
            ...(trigger ? { onClick: trigger } : {}),
          }"
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
        </ExTooltipButton>
      </template>
    </component>
  </div>
</template>

<script setup>
import Arrange from './components/arrange/index.vue'
import Log from './components/log/index.vue'
import Restart from './components/restart/index.vue'
import Search from './components/search/index.vue'
import Task from './components/task/index.vue'
import Terminal from './components/terminal/index.vue'

const props = defineProps({})

const actionModel = [
  {
    label: 'device.arrange.name',
    svgIcon: 'window-split',
    component: Arrange,
  },
  {
    label: 'device.terminal.name',
    svgIcon: 'command',
    component: Terminal,
  },
  {
    label: 'device.task.list',
    elIcon: 'Clock',
    component: Task,
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

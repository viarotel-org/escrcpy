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
            <el-icon v-if="item.elIcon" :class="item.iconClass">
              <component :is="item.elIcon" />
            </el-icon>
            <i v-else-if="item.fontIcon" :class="item.fontIcon"></i>
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
    fontIcon: 'i-bi-window-split',
    component: Arrange,
  },
  {
    label: 'device.terminal.name',
    fontIcon: 'i-bi-terminal',
    component: Terminal,
  },
  {
    label: 'device.task.list',
    fontIcon: 'i-bi-clock',
    component: Task,
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

function handleCommand() {}
</script>

<style></style>

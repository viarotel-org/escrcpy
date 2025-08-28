<template>
  <div class="flex items-center space-x-4 relative z-10">
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
      <template #default="{ ...slotProps } = {}">
        <EleTooltipButton
          v-bind="{
            type: 'default',
            content: $t(item.tips || item.label),
            circle: true,
            borderless: true,
            size: 'small',
            effect: 'light',
            ...slotProps,
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
        </EleTooltipButton>
      </template>
    </component>
  </div>
</template>

<script setup>
import Arrange from './components/Arrange/index.vue'
import Log from './components/Log/index.vue'
import Restart from './components/Restart/index.vue'
import Search from './components/Search/index.vue'
import Task from './components/Task/index.vue'
import Terminal from './components/Terminal/index.vue'

const props = defineProps({})

const actionModel = [
  {
    label: 'device.arrange.name',
    elIcon: 'DataBoard',
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

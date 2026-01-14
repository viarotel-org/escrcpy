<template>
  <Scrollable>
    <el-button-group class="flex items-center">
      <component
        :is="item.component"
        v-for="(item, index) in actionModel"
        :key="index"
        class="flex-none"
        v-bind="{
          devices,
          ...(item.command
            ? {
              onClick: () => handleShell(item),
            }
            : {}),
        }"
      >
        <template #default="{ loading = false, trigger }">
          <el-button
            plain
            :title="$t(item.tips || item.label)"
            :loading="loading"
            v-bind="{
              ...(trigger ? {
                onClick: () => trigger(devices),
              } : {}),
            }"
          >
            <template #icon>
              <el-icon v-if="item.elIcon" :class="item.iconClass">
                <component :is="item.elIcon" />
              </el-icon>
              <i v-else-if="item.fontIcon" :class="item.fontIcon"></i>
            </template>
          </el-button>
        </template>
      </component>
    </el-button-group>
  </Scrollable>
</template>

<script setup>
import Mirror from './mirror/index.vue'
import Application from './application/index.vue'
import FilePush from './file-push/index.vue'
import Screenshot from './screenshot/index.vue'
import Script from './script/index.vue'
import Tasks from './tasks/index.vue'
import Copilot from './copilot/index.vue'
import Delete from './delete/index.vue'

const props = defineProps({
  devices: {
    type: Array,
    default: () => [],
  },
})

const actionModel = [
  {
    label: 'device.mirror.start',
    elIcon: 'Monitor',
    component: Mirror,
  },
  {
    label: 'device.remove',
    fontIcon: 'i-bi-trash',
    component: Delete,
  },
  {
    label: 'device.control.capture',
    fontIcon: 'i-bi-camera',
    component: Screenshot,
  },
  {
    label: 'device.control.install',
    fontIcon: 'i-bi-file-arrow-up',
    component: Application,
  },
  {
    label: 'device.control.file.push',
    fontIcon: 'i-bi-folder',
    component: FilePush,
  },
  {
    label: 'terminal.script.name',
    fontIcon: 'i-bi-terminal',
    component: Script,
  },
  {
    label: 'device.control.copilot',
    fontIcon: 'i-carbon-chat-bot',
    component: Copilot,
  },
  {
    label: 'device.task.name',
    fontIcon: 'i-bi-clock',
    component: Tasks,
  },
]
</script>

<style></style>

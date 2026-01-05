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
    elIcon: 'Delete',
    component: Delete,
  },
  {
    label: 'device.control.capture',
    svgIcon: 'screenshot',
    component: Screenshot,
  },
  {
    label: 'device.control.install',
    svgIcon: 'mobile-install',
    component: Application,
  },
  {
    label: 'device.control.file.push',
    elIcon: 'Folder',
    component: FilePush,
  },
  {
    label: 'terminal.script.name',
    svgIcon: 'command',
    component: Script,
  },
  {
    label: 'device.control.copilot',
    svgIcon: 'copilot',
    component: Copilot,
  },
  {
    label: 'device.task.name',
    elIcon: 'Clock',
    component: Tasks,
  },
]
</script>

<style></style>

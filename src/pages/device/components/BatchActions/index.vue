<template>
  <Scrollable>
    <div class="flex items-center space-x-2">
      <component
        :is="item.component || 'div'"
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
        <template #default="{ loading = false } = {}">
          <el-button
            plain
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
            {{ $t(item.label) }}
          </el-button>
        </template>
      </component>
    </div>
  </Scrollable>
</template>

<script setup>
import Mirror from './Mirror/index.vue'
import Application from './Application/index.vue'
import FilePush from './FilePush/index.vue'
import Screenshot from './Screenshot/index.vue'
import Script from './Script/index.vue'
import Tasks from './Tasks/index.vue'

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
    label: 'device.control.capture',
    elIcon: 'Crop',
    component: Screenshot,
  },
  {
    label: 'device.control.install',
    svgIcon: 'install',
    component: Application,
  },
  {
    label: 'device.control.file.push',
    svgIcon: 'file-send',
    component: FilePush,
  },
  {
    label: 'device.control.terminal.script.name',
    svgIcon: 'command',
    component: Script,
  },
  {
    label: 'device.task.name',
    elIcon: 'Clock',
    component: Tasks,
  },
]
</script>

<style></style>

<template>
  <div class="flex items-center">
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
          type="primary"
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
          {{ $t('common.batch') }}-{{ $t(item.label) }}
        </el-button>
      </template>
    </component>
  </div>
</template>

<script>
import AppInstall from './AppInstall/index.vue'

export default {
  components: {
    AppInstall,
  },
  props: {
    devices: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      actionModel: [
        {
          label: 'device.control.install',
          svgIcon: 'install',
          component: 'AppInstall',
        },
      ],
    }
  },
  methods: {
    handleShell() {},
  },
}
</script>

<style></style>

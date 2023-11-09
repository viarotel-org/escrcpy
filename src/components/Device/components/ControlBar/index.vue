<template>
  <div
    ref="wheelContainer"
    class="bg-primary-100 dark:bg-gray-800 -my-[8px] flex flex-nowrap overflow-hidden"
    title="滚动查看被遮盖的菜单"
  >
    <component
      :is="item.component || 'div'"
      v-for="(item, index) in controlModel"
      :key="index"
      class="flex-none"
      v-bind="{
        device,
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
          class="!border-none !mx-0 bg-transparent !rounded-0"
          :disabled="device.$unauthorized"
          :title="$t(item.tips || item.label)"
          :loading="loading"
          @wheel.prevent="onWheel"
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
</template>

<script>
import Screenshot from './Screenshot/index.vue'
import AppInstall from './AppInstall/index.vue'
import Gnirehtet from './Gnirehtet/index.vue'
import MirrorGroup from './MirrorGroup/index.vue'
import Rotation from './Rotation/index.vue'

export default {
  components: {
    Screenshot,
    AppInstall,
    Gnirehtet,
    MirrorGroup,
    Rotation,
  },
  props: {
    device: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      controlModel: [
        {
          label: 'device.control.switch',
          elIcon: 'Switch',
          command: 'input keyevent KEYCODE_APP_SWITCH',
        },
        {
          label: 'device.control.home',
          svgIcon: 'home',
          command: 'input keyevent KEYCODE_HOME',
        },
        {
          label: 'device.control.return',
          elIcon: 'Back',
          command: 'input keyevent KEYCODE_BACK',
        },
        {
          label: 'device.control.notification',
          elIcon: 'Notification',
          command: 'cmd statusbar expand-notifications',
          tips: 'device.control.notification.tips',
        },
        {
          label: 'device.control.power',
          elIcon: 'SwitchButton',
          command: 'input keyevent KEYCODE_POWER',
          tips: 'device.control.power.tips',
        },
        {
          label: 'device.control.reboot',
          elIcon: 'RefreshLeft',
          command: 'reboot',
        },
        {
          label: 'device.control.rotation.name',
          svgIcon: 'rotation',
          component: 'Rotation',
        },
        {
          label: 'device.control.volume-down.name',
          svgIcon: 'volume-down',
          command: 'input keyevent KEYCODE_VOLUME_DOWN',
        },
        {
          label: 'device.control.volume-up.name',
          svgIcon: 'volume-up',
          command: 'input keyevent KEYCODE_VOLUME_UP',
        },
        {
          label: 'device.control.volume-mute.name',
          svgIcon: 'volume-mute',
          command: 'input keyevent KEYCODE_VOLUME_MUTE',
        },
        {
          label: 'device.control.capture',
          elIcon: 'Crop',
          component: 'Screenshot',
          tips: '',
        },
        {
          label: 'device.control.install',
          svgIcon: 'install',
          component: 'AppInstall',
          tips: '',
        },
        {
          label: 'device.control.gnirehtet',
          elIcon: 'Link',
          component: 'Gnirehtet',
          tips: 'device.control.gnirehtet.tips',
        },
        {
          label: 'device.control.mirror-group.name',
          svgIcon: 'multi-screen',
          iconClass: '',
          component: 'MirrorGroup',
          tips: 'device.control.mirror-group.tips',
        },
      ],
    }
  },
  computed: {},
  methods: {
    onWheel(event) {
      const container = this.$refs.wheelContainer
      container.scrollLeft += event.deltaY
    },
    handleShell(row) {
      this.$adb.deviceShell(this.device.id, row.command)
    },
  },
}
</script>

<style lang="postcss" scoped>
.el-button.is-disabled {
  @apply !dark:bg-gray-800;
}
</style>

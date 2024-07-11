<template>
  <div
    ref="wheelContainer"
    class="bg-primary-100 dark:bg-gray-800 -my-[8px] flex flex-nowrap overflow-hidden scroll-smooth px-4 group"
  >
    <el-button
      type="primary"
      class="el-button-nav prev"
      title="Prev"
      @click="handlePrev"
    >
      <el-icon>
        <CaretLeft />
      </el-icon>
    </el-button>
    <el-button
      type="primary"
      class="el-button-nav next"
      title="Next"
      @click="handleNext"
    >
      <el-icon>
        <CaretRight />
      </el-icon>
    </el-button>
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
import Application from './Application/index.vue'
import Gnirehtet from './Gnirehtet/index.vue'
import MirrorGroup from './MirrorGroup/index.vue'
import Rotation from './Rotation/index.vue'
import Volume from './Volume/index.vue'
import FileManage from './FileManage/index.vue'

export default {
  components: {
    Screenshot,
    Application,
    Gnirehtet,
    MirrorGroup,
    Rotation,
    Volume,
    FileManage,
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
          command: 'input keyevent 187',
        },
        {
          label: 'device.control.home',
          svgIcon: 'home',
          command: 'input keyevent 3',
        },
        {
          label: 'device.control.return',
          elIcon: 'Back',
          command: 'input keyevent 4',
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
          command: 'input keyevent 26',
          tips: 'device.control.power.tips',
        },
        {
          label: 'device.control.rotation.name',
          svgIcon: 'rotation',
          component: 'Rotation',
        },
        {
          label: 'device.control.volume.name',
          svgIcon: 'volume-up',
          component: 'Volume',
        },
        {
          label: 'device.control.capture',
          elIcon: 'Crop',
          component: 'Screenshot',
        },
        {
          label: 'device.control.reboot',
          elIcon: 'RefreshLeft',
          command: 'reboot',
        },
        {
          label: 'device.control.install',
          svgIcon: 'install',
          component: 'Application',
        },
        {
          label: 'device.control.file.name',
          svgIcon: 'file-send',
          component: 'FileManage',
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
    handlePrev() {
      const container = this.$refs.wheelContainer

      if (container.scrollLeft <= 0) {
        return false
      }

      container.scrollLeft -= 100
    },
    handleNext() {
      const container = this.$refs.wheelContainer

      if (
        container.scrollLeft
        >= container.scrollWidth - container.clientWidth
      ) {
        return false
      }

      container.scrollLeft += 100
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

.el-button.el-button-nav {
  @apply p-0 rounded-none border-0 absolute z-10 inset-y-0 flex items-center justify-center opacity-0 bg-primary-100 dark:bg-gray-800 !hover:bg-primary-300 active:bg-primary-500 text-primary-600 hover:text-white w-4 group-hover:opacity-100 transition-opacity;
  &.prev {
    @apply left-0;
  }
  &.next {
    @apply right-0;
  }
}
</style>

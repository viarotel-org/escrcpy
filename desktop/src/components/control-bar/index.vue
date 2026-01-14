<template>
  <div
    class="bg-primary-100 dark:bg-gray-800 flex items-center group h-7 lg:h-9 overflow-hidden"
  >
    <el-button
      type="primary"
      class="el-button-nav"
      title="Prev"
      @click="handlePrev"
    >
      <el-icon>
        <CaretLeft />
      </el-icon>
    </el-button>

    <Scrollable ref="scrollableRef" class="flex-1 w-0" disabled-drag>
      <Swapy
        :key="controlStore.swapyKey"
        :enabled="swapyEnabled"
        class="flex items-center" :config="{ animation: 'dynamic', dragAxis: 'x', autoScrollOnDrag: false }"
        @swap-end="onSwapEnd"
      >
        <SwapyItem
          v-for="item of controlModel"
          :key="item.id"
          class="flex-none overflow-hidden"
          v-bind="{
            slotId: item.id,
            itemId: item.id,
          }"
        >
          <component
            :is="item.component || 'div'"
            v-bind="{
              device,
              floating,
            }"
          >
            <template #default="{ loading = false, trigger } = {}">
              <el-button
                type="primary"
                plain
                class="!border-none !mx-0 bg-transparent !rounded-0"
                :class="['unauthorized', 'offline'].includes(device.status) ? '!bg-transparent' : ''"
                :disabled="['unauthorized', 'offline'].includes(device.status)"
                :title="$t(item.tips || item.label)"
                :loading="loading"
                @click="handleClick(item, trigger || item.trigger)"
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
        </SwapyItem>
      </Swapy>
    </Scrollable>

    <el-button
      type="primary"
      class="el-button-nav"
      title="Next"
      @click="handleNext"
    >
      <el-icon>
        <CaretRight />
      </el-icon>
    </el-button>
  </div>
</template>

<script>
import Application from './application/index.vue'
import ApplicationStart from './application-start/index.vue'
import Copilot from './copilot/index.vue'
import Explorer from './explorer/index.vue'
import Gnirehtet from './gnirehtet/index.vue'
import Rotation from './rotation/index.vue'
import Screenshot from './screenshot/index.vue'
import Terminal from './terminal/index.vue'
import Tasks from './tasks/index.vue'
import Volume from './volume/index.vue'

export default {
  components: {
    Screenshot,
    Application,
    ApplicationStart,
    Copilot,
    Gnirehtet,
    Rotation,
    Volume,
    Explorer,
    Terminal,
    Tasks,
  },
  props: {
    device: {
      type: Object,
      default: () => ({}),
    },
    floating: {
      type: Boolean,
      default: false,
    },
    swapyEnabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const controlStore = useControlStore()

    return {
      controlStore,
    }
  },
  data() {
    return {}
  },
  computed: {
    controlModel() {
      const valueMap = {
        'switch': {
          label: 'device.control.switch',
          fontIcon: 'i-bi-list',
          command: 'input keyevent 187',
        },
        'home': {
          label: 'device.control.home',
          fontIcon: 'i-bi-app',
          command: 'input keyevent 3',
        },
        'back': {
          label: 'device.control.return',
          fontIcon: 'i-cil-caret-left',
          command: 'input keyevent 4',
        },
        'app-start': {
          label: 'device.control.startApp',
          fontIcon: 'i-famicons-rocket-outline',
          component: 'ApplicationStart',
        },
        'turn-screen-off': {
          label: 'device.control.turnScreenOff',
          fontIcon: 'i-bi-file-break',
          tips: 'device.control.turnScreenOff.tips',
          trigger: () => {
            window.scrcpy.helper(this.device.id, '--turn-screen-off')
          },
        },
        'notification': {
          label: 'device.control.notification',
          fontIcon: 'i-bi-bell',
          command: 'cmd statusbar expand-notifications',
          tips: 'device.control.notification.tips',
        },
        'power': {
          label: 'device.control.power',
          fontIcon: 'i-uiw-poweroff',
          command: 'input keyevent 26',
          tips: 'device.control.power.tips',
        },
        'rotation': {
          label: 'device.control.rotation.name',
          fontIcon: 'i-solar-smartphone-rotate-2-outline',
          component: 'Rotation',
        },
        'volume': {
          label: 'device.control.volume.name',
          fontIcon: 'i-simple-line-icons-volume-2',
          component: 'Volume',
        },
        'screenshot': {
          label: 'device.control.capture',
          fontIcon: 'i-simple-line-icons-camera',
          component: 'Screenshot',
        },
        'reboot': {
          label: 'device.control.reboot',
          fontIcon: 'i-iconoir-refresh',
          command: 'reboot',
        },
        'app-install': {
          label: 'device.control.install',
          fontIcon: 'i-bi-file-arrow-up',
          component: 'Application',
        },
        'explorer': {
          label: 'device.control.file.name',
          fontIcon: 'i-bi-folder',
          component: 'Explorer',
        },
        'terminal': {
          label: 'device.terminal.name',
          fontIcon: 'i-bi-terminal',
          component: 'Terminal',
          hiddenKeys: ['floating'],
        },
        'task': {
          label: 'device.task.name',
          fontIcon: 'i-bi-clock',
          component: 'Tasks',
          hiddenKeys: ['floating'],
        },
        'gnirehtet': {
          label: 'device.control.gnirehtet',
          fontIcon: 'i-bi-hdd-network',
          component: 'Gnirehtet',
          tips: 'device.control.gnirehtet.tips',
        },
        'copilot': {
          label: 'device.control.copilot',
          fontIcon: 'i-carbon-chat-bot',
          component: 'Copilot',
          tips: 'copilot.welcome.description',
        },
      }

      const isHidden = item =>
        (item.hiddenKeys || []).some(key => this.$props[key])

      const barLayout = [...new Set([...this.controlStore.barLayout, ...Object.keys(valueMap)])]

      const value = barLayout.reduce((arr, key) => {
        const item = valueMap[key]

        if (item && !isHidden(item)) {
          arr.push({
            ...item,
            id: key,
          })
        }

        return arr
      }, [])

      return value
    },
  },
  methods: {
    handlePrev() {
      this.$refs.scrollableRef.scrollBackward()
    },
    handleNext() {
      this.$refs.scrollableRef.scrollForward()
    },
    handleClick(row, trigger) {
      if (trigger) {
        trigger(row)
        return false
      }

      if (row?.command) {
        this.$adb.deviceShell(this.device.id, row.command)
      }
      else if (row?.scrcpyCommand) {
        this.$scrcpy.control(this.device.id, { command: row.scrcpyCommand })
      }
    },
    onSwapEnd(event) {
      const value = event.slotItemMap.asArray.map(obj => obj.item)

      this.controlStore.setBarLayout(value)
    },
  },
}
</script>

<style lang="postcss" scoped>
.el-button.is-disabled {
  @apply !dark:bg-gray-800;
}

.el-button.el-button-nav {
  @apply flex-none p-0 rounded-none border-0 h-full flex items-center justify-center opacity-0 bg-primary-100 dark:bg-gray-800 !hover:bg-primary-300 active:bg-primary-500 text-primary-600 hover:text-white w-4 group-hover:opacity-100 transition-opacity;
}
</style>

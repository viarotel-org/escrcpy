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
        :key="swapyKey"
        class="flex items-center" :config="{ animation: 'dynamic', dragAxis: 'x', autoScrollOnDrag: false }"
        @swap-end="onSwapEnd"
      >
        <SwapyItem
          v-for="item of controlModel"
          :key="item.id"
          class="flex-none"
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
import Application from './Application/index.vue'
import ApplicationStart from './ApplicationStart/index.vue'
import FileManage from './FileManage/index.vue'
import Gnirehtet from './Gnirehtet/index.vue'
import Rotation from './Rotation/index.vue'
import Screenshot from './Screenshot/index.vue'
import Terminal from './Terminal/index.vue'
import Tasks from './Tasks/index.vue'
import Volume from './Volume/index.vue'

export default {
  components: {
    Screenshot,
    Application,
    ApplicationStart,
    Gnirehtet,
    Rotation,
    Volume,
    FileManage,
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
    swapyKey() {
      const value = this.controlStore.barLayout.join('')

      return value
    },
    controlModel() {
      const valueMap = {
        'switch': {
          label: 'device.control.switch',
          elIcon: 'Switch',
          command: 'input keyevent 187',
        },
        'home': {
          label: 'device.control.home',
          svgIcon: 'home',
          command: 'input keyevent 3',
        },
        'back': {
          label: 'device.control.return',
          elIcon: 'Back',
          command: 'input keyevent 4',
        },
        'app-start': {
          label: 'device.control.startApp',
          elIcon: 'Files',
          component: 'ApplicationStart',
        },
        'turn-screen-off': {
          label: 'device.control.turnScreenOff',
          elIcon: 'TurnOff',
          tips: 'device.control.turnScreenOff.tips',
          trigger: () => {
            window.scrcpy.helper(this.device.id, '--turn-screen-off')
          },
        },
        'notification': {
          label: 'device.control.notification',
          elIcon: 'Notification',
          command: 'cmd statusbar expand-notifications',
          tips: 'device.control.notification.tips',
        },
        'power': {
          label: 'device.control.power',
          elIcon: 'SwitchButton',
          command: 'input keyevent 26',
          tips: 'device.control.power.tips',
        },
        'rotation': {
          label: 'device.control.rotation.name',
          svgIcon: 'rotation',
          component: 'Rotation',
        },
        'volume': {
          label: 'device.control.volume.name',
          svgIcon: 'volume-up',
          component: 'Volume',
        },
        'screenshot': {
          label: 'device.control.capture',
          elIcon: 'Crop',
          component: 'Screenshot',
        },
        'reboot': {
          label: 'device.control.reboot',
          elIcon: 'RefreshLeft',
          command: 'reboot',
        },
        'app-install': {
          label: 'device.control.install',
          svgIcon: 'install',
          component: 'Application',
        },
        'file-manage': {
          label: 'device.control.file.name',
          svgIcon: 'file-send',
          component: 'FileManage',
          hiddenKeys: ['floating'],
        },
        'terminal': {
          label: 'device.terminal.name',
          svgIcon: 'command',
          component: 'Terminal',
          hiddenKeys: ['floating'],
        },
        'task': {
          label: 'device.task.name',
          elIcon: 'Clock',
          component: 'Tasks',
          hiddenKeys: ['floating'],
        },
        'gnirehtet': {
          label: 'device.control.gnirehtet',
          elIcon: 'Link',
          component: 'Gnirehtet',
          tips: 'device.control.gnirehtet.tips',
        },
      }

      const handler = item =>
        !(item.hiddenKeys || []).some(key => this.$props[key])

      const barLayout = [...new Set([...this.controlStore.barLayout, ...Object.keys(valueMap)])]

      const value = barLayout.reduce((arr, key) => {
        const item = valueMap[key]

        if (item && handler(item)) {
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

<template>
  <div
    class="bg-primary-100 dark:bg-gray-800 flex group overflow-hidden"
    :class="direction === 'vertical' ? 'is-vertical h-full flex-col items-center' : ''"
  >
    <Scrollable
      class="flex-1 min-w-0"
      :class="direction === 'vertical' ? 'h-0 w-full' : ''"
      :direction="direction"
      disabled-drag
    >
      <Swapy
        :key="controlStore.swapyKey"
        :enabled="swapyEnabled"
        class="flex items-center"
        :class="[
          floating ? '!h-full' : '',
          direction === 'vertical' ? '!h-auto w-full flex-col gap-2 !space-x-0' : '',
        ]"
        :config="{ animation: 'dynamic', dragAxis: direction === 'vertical' ? 'y' : 'x', autoScrollOnDrag: false }"
        @swap-end="onSwapEnd"
      >
        <SwapyItem
          v-for="item of scrollControlModel"
          :key="item.id"
          class="flex-none"
          :class="[buttonClass, direction === 'vertical' ? 'w-full flex justify-center' : '']"
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
                class="!border-none !mx-0 !py-0 bg-transparent !rounded-0"
                :class="[
                  ['unauthorized', 'offline'].includes(device.status) ? '!bg-transparent' : '',
                  buttonClass,
                ]"
                :style="{
                  ...buttonHeightStyle,
                }"
                :disabled="['unauthorized', 'offline'].includes(device.status)"
                :title="$t(item.tips || item.label)"
                :loading="loading"
                @click="handleClick(item, item.trigger || trigger)"
              >
                <template #icon>
                  <el-icon v-if="item.elIcon" :class="item.iconClass">
                    <component :is="item.elIcon" />
                  </el-icon>

                  <i v-else-if="item.fontIcon" :class="[item.fontIcon, item.iconClass]"></i>
                </template>
              </el-button>
            </template>
          </component>
        </SwapyItem>
      </Swapy>
    </Scrollable>

    <div
      v-if="fixedNavigationModel.length"
      class="fixed-navigation-group flex w-full flex-none flex-col border-t border-white/10 py-1"
    >
      <div
        v-for="item of fixedNavigationModel"
        :key="item.id"
        class="w-full"
      >
        <button
          type="button"
          class="fixed-navigation-button"
          :disabled="['unauthorized', 'offline'].includes(device.status)"
          :title="$t(item.tips || item.label)"
          @click="handleClick(item, item.trigger)"
        >
          <i :class="item.fontIcon"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { controlBarHeight } from '$control/configs/index.js'
import Install from './install/index.vue'
import Launch from './launch/index.vue'
import Explorer from './explorer/index.vue'
import Gnirehtet from './gnirehtet/index.vue'
import Rotation from './rotation/index.vue'
import Screenshot from './screenshot/index.vue'
import Terminal from './terminal/index.vue'
import Schedule from './schedule/index.vue'
import Volume from './volume/index.vue'
import KeyboardMapping from './keyboard-mapping/index.vue'

export default {
  components: {
    Screenshot,
    Install,
    Launch,
    Gnirehtet,
    Rotation,
    Volume,
    KeyboardMapping,
    Explorer,
    Terminal,
    Schedule,
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
    buttonHeight: {
      type: Number,
      default: controlBarHeight,
    },
    buttonClass: {
      type: String,
      default: '',
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator: value => ['horizontal', 'vertical'].includes(value),
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
    fixedNavigationIds() {
      // DOM order is top-to-bottom: task switch, Home, then Back at the
      // physical bottom of the mirror toolbar.
      return this.direction === 'vertical' && this.floating
        ? ['switch', 'home', 'back']
        : []
    },
    controlModel() {
      const valueMap = {
        switch: {
          label: 'device.control.switch',
          fontIcon: 'i-proicons-menu',
          command: 'input keyevent 187',
        },
        home: {
          label: 'device.control.home',
          fontIcon: 'i-bi-app',
          command: 'input keyevent 3',
        },
        back: {
          label: 'device.control.return',
          fontIcon: 'i-cil-caret-left',
          command: 'input keyevent 4',
        },
        launch: {
          label: 'device.control.launch',
          fontIcon: 'i-famicons-rocket-outline',
          component: 'Launch',
        },
        turnScreenOff: {
          label: 'device.control.turnScreenOff',
          fontIcon: 'i-bi-file-break',
          tips: 'device.control.turnScreenOff.tips',
          trigger: () => {
            window.$preload.scrcpy.helper(this.device.id, '--turn-screen-off')
          },
        },
        notification: {
          label: 'device.control.notification',
          fontIcon: 'i-bi-bell',
          command: 'cmd statusbar expand-notifications',
          tips: 'device.control.notification.tips',
        },
        power: {
          label: 'device.control.power',
          fontIcon: 'i-uiw-poweroff',
          command: 'input keyevent 26',
          tips: 'device.control.power.tips',
        },
        rotation: {
          label: 'device.control.rotation.name',
          fontIcon: 'i-solar-smartphone-rotate-2-outline',
          component: 'Rotation',
        },
        volume: {
          label: 'device.control.volume.name',
          fontIcon: 'i-simple-line-icons-volume-2',
          component: 'Volume',
          hiddenKeys: ['floating'],
        },
        volumeUp: {
          label: 'device.control.volume-up.name',
          fontIcon: 'i-material-symbols-volume-up-rounded',
          iconClass: 'volume-button-icon',
          command: 'input keyevent 24',
          floatingOnly: true,
        },
        volumeDown: {
          label: 'device.control.volume-down.name',
          fontIcon: 'i-material-symbols-volume-down-rounded',
          iconClass: 'volume-button-icon',
          command: 'input keyevent 25',
          floatingOnly: true,
        },
        volumeMute: {
          label: 'device.control.volume-mute.name',
          fontIcon: 'i-material-symbols-volume-off-rounded',
          iconClass: 'volume-button-icon',
          command: 'input keyevent 164',
          floatingOnly: true,
        },
        screenshot: {
          label: 'device.control.capture',
          fontIcon: 'i-simple-line-icons-camera',
          component: 'Screenshot',
        },
        keyboardMapping: {
          label: 'keyboard.mapping.name',
          fontIcon: 'i-grommet-icons-gamepad',
          tips: 'keyboard.mapping.tips',
          floatingOnly: true,
          component: 'KeyboardMapping',
        },
        reboot: {
          label: 'device.control.reboot',
          fontIcon: 'i-iconoir-refresh',
          command: 'reboot',
        },
        install: {
          label: 'device.control.install',
          fontIcon: 'i-bi-file-arrow-up',
          component: 'Install',
        },
        explorer: {
          label: 'device.control.file.name',
          fontIcon: 'i-bi-folder',
          component: 'Explorer',
        },
        terminal: {
          label: 'device.terminal.name',
          fontIcon: 'i-bi-terminal',
          component: 'Terminal',
        },
        schedule: {
          label: 'device.schedule.name',
          fontIcon: 'i-bi-clock',
          component: 'Schedule',
          hiddenKeys: ['floating'],
        },
        gnirehtet: {
          label: 'device.control.gnirehtet',
          fontIcon: 'i-bi-hdd-network',
          component: 'Gnirehtet',
          tips: 'device.control.gnirehtet.tips',
        },
      }

      const isHidden = item =>
        (item.floatingOnly && !this.floating)
        || (item.hiddenKeys || []).some(key => this.$props[key])

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
    scrollControlModel() {
      return this.controlModel.filter(item => !this.fixedNavigationIds.includes(item.id))
    },
    fixedNavigationModel() {
      return this.fixedNavigationIds
        .map(id => this.controlModel.find(item => item.id === id))
        .filter(Boolean)
    },
    buttonHeightStyle() {
      if (this.direction === 'vertical') {
        return {
          width: '32px !important',
          height: '32px !important',
        }
      }

      if (!this.buttonHeight) {
        return {}
      }

      return {
        height: `${this.buttonHeight}px !important`,
      }
    },
  },
  methods: {
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

.is-vertical {
  width: 48px !important;
  min-width: 48px !important;
  max-width: 48px !important;
  background: #171717 !important;
}

.is-vertical :deep(.el-button) {
  color: #d1d5db;
}

.is-vertical :deep(.volume-button-icon) {
  width: 22px !important;
  height: 22px !important;
  font-size: 22px !important;
}

.fixed-navigation-button {
  width: 48px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  color: #d1d5db;
  background: transparent;
}

.fixed-navigation-button:hover:not(:disabled) {
  color: var(--el-color-primary);
  background: rgb(255 255 255 / 6%);
}

.is-vertical .fixed-navigation-group {
  transform: translateX(-8px);
}
</style>

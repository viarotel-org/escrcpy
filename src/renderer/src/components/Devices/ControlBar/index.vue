<template>
  <div class="bg-primary-100 -my-[8px]">
    <el-button
      v-for="(item, index) in controlModel"
      :key="index"
      type="primary"
      plain
      class="!border-none !mx-0 bg-transparent !rounded-0"
      :icon="item.icon"
      :disabled="device.$unauthorized"
      :title="item.tips"
      @click="handleClick(item)"
    >
      {{ item.label }}
    </el-button>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import LoadingIcon from './LoadingIcon/index.vue'

export default {
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
          label: '切换键',
          icon: 'Switch',
          command: 'input keyevent KEYCODE_APP_SWITCH',
        },
        {
          label: '主屏幕键',
          icon: 'HomeFilled',
          command: 'input keyevent KEYCODE_HOME',
        },
        {
          label: '返回键',
          icon: 'Back',
          command: 'input keyevent KEYCODE_BACK',
        },
        {
          label: '菜单键',
          icon: 'Menu',
          command: 'input keyevent KEYCODE_MENU',
          tips: '不要和切换键搞错啦',
        },
        {
          label: '电源键',
          icon: 'SwitchButton',
          command: 'input keyevent KEYCODE_POWER',
          tips: '可以用来开启或关闭屏幕',
        },
        {
          label: '截屏快照',
          icon: 'Crop',
          handle: this.handleScreenCap,
          tips: '不要和切换键搞错啦',
        },
      ],
    }
  },
  computed: {
    scrcpyConfig() {
      return this.$store.scrcpy.config
    },
  },
  methods: {
    handleClick(row) {
      if (row.command) {
        this.$adb.deviceShell(this.device.id, row.command)
      }
      else if (row.handle) {
        row.handle(this.device)
      }
      else {
        return false
      }
    },
    async handleScreenCap(device) {
      const deviceName = device.name || device.id

      const messageEl = this.$message({
        message: ` 正在截取 ${deviceName} 的屏幕快照...`,
        icon: LoadingIcon,
        duration: 0,
      })

      const fileName = `${deviceName}-screencap-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.png`
      const savePath = this.$path.resolve(this.scrcpyConfig['--record'], fileName)

      try {
        await this.$adb.screencap(device.id, { savePath })
        this.handleScreencapSuccess(savePath)
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }

      messageEl.close()
    },
    async handleScreencapSuccess(savePath) {
      try {
        await this.$confirm('是否前往截屏位置进行查看？', '录制成功', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'success',
        })
        this.$electron.ipcRenderer.invoke('show-item-in-folder', savePath)
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }
    },
  },
}
</script>

<style></style>

<template>
  <div class="bg-primary-100 -my-[8px]">
    <el-button
      v-for="(item, index) in controlModel"
      :key="index"
      type="primary"
      plain
      class="!border-none !mx-0 bg-transparent !rounded-0"
      :disabled="device.$unauthorized"
      :title="item.tips"
      @click="handleClick(item)"
    >
      <template #icon>
        <svg-icon v-if="item.svgIcon" :name="item.svgIcon"></svg-icon>
        <el-icon v-else-if="item.elIcon" class="">
          <component :is="item.elIcon" />
        </el-icon>
      </template>
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
          elIcon: 'Switch',
          command: 'input keyevent KEYCODE_APP_SWITCH',
        },
        {
          label: '主屏幕键',
          elIcon: 'HomeFilled',
          command: 'input keyevent KEYCODE_HOME',
        },
        {
          label: '返回键',
          elIcon: 'Back',
          command: 'input keyevent KEYCODE_BACK',
        },
        {
          label: '菜单键',
          elIcon: 'Menu',
          command: 'input keyevent KEYCODE_MENU',
          tips: '不要和切换键搞错啦',
        },
        {
          label: '电源键',
          elIcon: 'SwitchButton',
          command: 'input keyevent KEYCODE_POWER',
          tips: '可以用来开启或关闭屏幕',
        },
        {
          label: '截取屏幕',
          elIcon: 'Crop',
          handle: this.handleScreenCap,
          tips: '',
        },
        {
          label: '安装应用',
          svgIcon: 'install',
          handle: this.handleInstall,
          tips: '',
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
    async handleInstall(device) {
      const files = await this.$electron.ipcRenderer.invoke(
        'show-open-dialog',
        {
          properties: ['openFile', 'multiSelections'],
          filters: [{ name: '请选择要安装的应用', extensions: ['apk'] }],
        },
      )

      if (!files) {
        return false
      }

      const messageEl = this.$message({
        message: ` 正在为 ${device.name} 安装应用中...`,
        icon: LoadingIcon,
        duration: 0,
      })

      let failCount = 0

      for (let index = 0; index < files.length; index++) {
        const item = files[index]
        await this.$adb.install(device.id, item).catch((e) => {
          console.warn(e)
          ++failCount
        })
      }

      messageEl.close()

      const totalCount = files.length
      const successCount = totalCount - failCount

      if (successCount) {
        if (totalCount > 1) {
          this.$message.success(
            `已成功将应用安装到 ${device.name} 中，共 ${totalCount}个，成功 ${successCount}个，失败 ${failCount}个`,
          )
        }
        else {
          this.$message.success(`已成功将应用安装到 ${device.name} 中`)
        }
        return
      }

      this.$message.warning('安装应用失败，请检查安装包后重试')
    },
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
      const messageEl = this.$message({
        message: ` 正在截取 ${device.name} 的屏幕快照...`,
        icon: LoadingIcon,
        duration: 0,
      })

      const fileName = `${device.name}-screencap-${dayjs().format(
        'YYYY-MM-DD-HH-mm-ss',
      )}.png`
      const savePath = this.$path.resolve(
        this.scrcpyConfig['--record'],
        fileName,
      )

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

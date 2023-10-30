<template>
  <div
    ref="wheelContainer"
    class="bg-primary-100 dark:bg-gray-800 -my-[8px] flex flex-nowrap overflow-hidden"
    title="滚动查看被遮盖的菜单"
  >
    <el-button
      v-for="(item, index) in controlModel"
      :key="index"
      type="primary"
      plain
      class="!border-none !mx-0 bg-transparent !rounded-0 flex-none"
      :disabled="device.$unauthorized"
      :title="item.tips ? $t(item.tips) : ''"
      @wheel.prevent="onWheel"
      @click="handleClick(item)"
    >
      <template #icon>
        <svg-icon v-if="item.svgIcon" :name="item.svgIcon"></svg-icon>
        <el-icon v-else-if="item.elIcon" class="">
          <component :is="item.elIcon" />
        </el-icon>
      </template>
      {{ $t(item.label) }}
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
          label: 'device.control.switch',
          elIcon: 'Switch',
          command: 'input keyevent KEYCODE_APP_SWITCH',
        },
        {
          label: 'device.control.home',
          elIcon: 'HomeFilled',
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
          label: 'device.control.capture',
          elIcon: 'Crop',
          handle: this.handleScreenCap,
          tips: '',
        },
        {
          label: 'device.control.install',
          svgIcon: 'install',
          handle: this.handleInstall,
          tips: '',
        },
        {
          label: 'device.control.gnirehtet',
          elIcon: 'Link',
          handle: this.handleGnirehtet,
          tips: 'device.control.gnirehtet.tips',
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
    preferenceData(...args) {
      return this.$store.preference.getData(...args)
    },
    async handleGnirehtet(device) {
      const messageEl = this.$message({
        message: this.$t('device.control.gnirehtet.progress', {
          deviceName: device.$name,
        }),
        icon: LoadingIcon,
        duration: 0,
      })

      try {
        await this.$gnirehtet.run(device.id)
        this.$message.success(this.$t('device.control.gnirehtet.success'))
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }

      messageEl.close()
    },
    async handleInstall(device) {
      let files = null

      try {
        files = await this.$electron.ipcRenderer.invoke('show-open-dialog', {
          properties: ['openFile', 'multiSelections'],
          filters: [
            {
              name: this.$t('device.control.install.placeholder'),
              extensions: ['apk'],
            },
          ],
        })
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }

      if (!files) {
        return false
      }

      const messageEl = this.$message({
        message: this.$t('device.control.install.progress', {
          deviceName: device.$name,
        }),
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
            this.$t('device.control.install.success', {
              deviceName: device.$name,
              totalCount,
              successCount,
              failCount,
            }),
          )
        }
        else {
          this.$message.success(
            this.$t('device.control.install.success.single', {
              deviceName: device.$name,
            }),
          )
        }
        return
      }

      this.$message.warning(this.$t('device.control.install.error'))
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
        message: this.$t('device.control.capture.progress', {
          deviceName: device.$name,
        }),
        icon: LoadingIcon,
        duration: 0,
      })

      const fileName = `${device.$remark ? `${device.$remark}-` : ''}${
        device.$name
      }-${this.$replaceIP(device.id)}-screencap-${dayjs().format(
        'YYYY-MM-DD-HH-mm-ss',
      )}.png`

      const deviceConfig = this.preferenceData(device.id)
      const savePath = this.$path.resolve(deviceConfig.savePath, fileName)

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
        await this.$confirm(
          this.$t('device.control.capture.success.message'),
          this.$t('device.control.capture.success.message.title'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            closeOnClickModal: false,
            type: 'success',
          },
        )

        await this.$electron.ipcRenderer.invoke(
          'show-item-in-folder',
          savePath,
        )
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

<style lang="postcss" scoped>
.el-button.is-disabled {
  @apply !dark:bg-gray-800;
}
</style>

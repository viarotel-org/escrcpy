<template>
  <el-dropdown
    :disabled="loading || floating"
    max-height="300px"
    trigger="click"
    @visible-change="onVisibleChange"
    @mouseenter="getAppData"
  >
    <slot :loading :trigger="handleTrigger" />

    <template #dropdown>
      <el-dropdown-menu>
        <div class="sticky top-0 z-10 px-2 pt-2 pb-2 bg-[var(--el-bg-color-overlay)] border-b dark:border-gray-700">
          <el-input v-model="keyword" class="!w-full" :placeholder="$t('common.search')" prefix-icon="Search"></el-input>
        </div>

        <el-dropdown-item
          v-for="item of options"
          :key="item.value"
          :command="item.value"
          :divided="item.divided"
          :icon="item.icon"
          @click="onStartClick(item)"
        >
          <div class="pr-12">
            {{ $t(item.label) }}
          </div>

          <div class="absolute inset-y-center right-1 z-5 flex items-center">
            <el-link v-if="['win32'].includes(platform)" type="primary" :underline="false" icon="TopRight" class="" :title="$t('desktop.shortcut.add')" @click.stop="onShortcutClick(item)"></el-link>
            <el-link type="primary" :underline="false" icon="Monitor" class="" :title="$t('device.control.startApp.useMainScreen')" @click.stop="onMainStartClick(item)"></el-link>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { openFloatControl } from '$/utils/device/index.js'

import { pinyin } from 'pinyin-pro'
import { sleep } from '$/utils'
import { useStartApp } from '$/hooks/useStartApp/index.js'

export default {
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
    const startApp = useStartApp()
    const deviceStore = useDeviceStore()

    return {
      deviceStore,
      startApp,
      platform: window.electron?.process?.platform,
    }
  },
  data() {
    return {
      loading: false,
      appList: [],
      keyword: '',
    }
  },
  computed: {
    options() {
      const value = this.appList.map(item => ({
        ...item,
        label: `${item.name}[${item.packageName}]`,
        value: item.packageName,
      }))

      value.unshift({
        label: this.$t('device.control.home'),
        value: '',
        icon: 'HomeFilled',
      })

      if (this.keyword) {
        return value.filter((item) => {
          const pinyinLabel = pinyin(item.label, { toneType: 'none' }).replaceAll(' ', '')

          const matchText = [item.label, item.value, pinyinLabel, pinyinLabel.toLowerCase()].join('')

          return matchText.includes(this.keyword)
        })
      }

      return value
    },
  },
  methods: {
    async onVisibleChange(val) {
      if (!val) {
        await sleep()
        this.keyword = ''
      }
    },
    async getAppData() {
      if (!['device'].includes(this.device.status)) {
        return false
      }

      const data = await window.scrcpy.getAppList(this.device.id)

      this.appList = data || []
    },
    handleTrigger() {
      if (!this.floating) {
        return false
      }
      const channel = 'startApp'

      window.electron.ipcRenderer.once(
        channel,
        (event, value, item) => {
          this.onStartClick(item)
        },
      )

      const options = toRaw(this.options)

      window.electron.ipcRenderer.send('open-system-menu', {
        channel,
        options,
      })
    },
    async onStartClick({ label, value }) {
      this.startApp.open({
        deviceId: this.device.id,
        appName: label,
        packageName: value,
      })

      openFloatControl(toRaw(this.device))
    },
    onMainStartClick({ label, value }) {
      this.startApp.open({
        deviceId: this.device.id,
        appName: label,
        packageName: value,
        useNewDisplay: false,
      })

      openFloatControl(toRaw(this.device))
    },
    onShortcutClick(item) {
      const desktopName = this.deviceStore.getLabel(this.device, ({ deviceName }) => `${item.label}-${deviceName}`)

      let shortcutArguments = `--device-id=${this.device.id} --app-name=${item.label}`

      if (item.value) {
        shortcutArguments += ` --package-name=${item.value}`
      }

      const result = this.$desktop.createShortcuts({
        name: desktopName,
        comment: desktopName,
        arguments: shortcutArguments,
      })

      if (result) {
        this.$message.success(this.$t('common.success'))
        return false
      }

      this.$message.warning(this.$t('common.fail'))
    },
  },
}
</script>

<style></style>

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
          @click="handleCommand(item)"
        >
          {{ $t(item.label) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { openFloatControl } from '$/utils/device/index.js'

import { pinyin } from 'pinyin-pro'
import { sleep } from '$/utils'

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
        label: item.name,
        value: item.packageName,
      }))

      value.unshift({
        label: this.$t('device.control.home'),
        value: '',
        icon: 'HomeFilled',
      })

      if (this.keyword) {
        return value.filter((item) => {
          const pinyinLabel = pinyin(item.label, { toneType: 'none' })
          return (item.label + pinyinLabel).includes(this.keyword)
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
          this.handleCommand(item)
        },
      )

      const options = toRaw(this.options)

      window.electron.ipcRenderer.send('open-system-menu', {
        channel,
        options,
      })
    },
    async handleCommand({ label, value }) {
      this.loading = true

      const title = `${this.$store.device.getLabel(this.device, 'synergy')}-${label}`

      const commands = this.$store.preference.scrcpyParameter(this.device.id, {
        excludes: ['--otg', '--mouse=aoa', '--keyboard=aoa'],
      })

      await window.scrcpy.startApp(this.device.id, { title, commands, packageName: value })
        .catch((e) => {
          console.error('mirror.commands', commands)
          console.error('mirror.error', e)
          if (e.message) {
            this.$message.warning(e.message)
          }
        })

      openFloatControl(toRaw(this.device))

      this.loading = false
    },
  },
}
</script>

<style></style>

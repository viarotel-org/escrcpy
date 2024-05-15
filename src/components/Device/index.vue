<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center flex-none space-x-2 pt-1">
      <Wireless ref="wireless" :reload="getDeviceData" />

      <div class="w-px h-7 !ml-4 !mr-2 bg-gray-200"></div>

      <el-button
        type="primary"
        plain
        :icon="loading ? '' : 'Refresh'"
        :loading="loading"
        @click="handleRefresh"
      >
        {{ $t('device.refresh.name') }}
      </el-button>

      <el-button
        type="warning"
        plain
        icon="RefreshRight"
        @click="handleRestart"
      >
        {{ $t('device.restart.name') }}
      </el-button>

      <el-button plain icon="View" @click="handleLog">
        {{ $t('device.log.name') }}
      </el-button>

      <TerminalAction />
    </div>
    <div class="pt-4 flex-1 h-0 overflow-hidden">
      <el-table
        ref="elTable"
        v-loading="loading"
        :element-loading-text="$t('common.loading')"
        :data="deviceList"
        style="width: 100%"
        border
        height="100%"
        row-key="id"
      >
        <template #empty>
          <el-empty :description="$t('device.list.empty')" />
        </template>
        <el-table-column
          prop="id"
          :label="$t('device.id')"
          show-overflow-tooltip
          align="left"
          width="200"
        />
        <el-table-column
          :label="$t('device.name')"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <div class="flex items-center">
              <el-tooltip
                v-if="row.$unauthorized"
                :content="$t('device.permission.error')"
                placement="top-start"
              >
                <el-icon class="mr-1 text-red-600 text-lg">
                  <WarningFilled />
                </el-icon>
              </el-tooltip>

              {{ row.$name }}

              <div class="ml-2">
                <Remark :device="row" class="" />
              </div>

              <el-tag v-if="row.$wifi" effect="light" class="ml-2">
                WIFI
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-slot="{ row, $index }"
          :label="$t('device.control.name')"
          width="450"
          align="left"
        >
          <MirrorAction
            :ref="(value) => getMirrorActionRefs(value, $index)"
            v-bind="{ row, toggleRowExpansion, handleReset }"
          />

          <MoreDropdown v-bind="{ row, toggleRowExpansion, handleReset }" />

          <WirelessAction v-bind="{ row, handleConnect }" />
        </el-table-column>
        <el-table-column type="expand">
          <template #header>
            <el-icon class="" :title="$t('device.control.more')">
              <Operation class="" />
            </el-icon>
          </template>

          <template #default="{ row }">
            <ControlBar :device="row" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ControlBar from './components/ControlBar/index.vue'
import Remark from './components/Remark/index.vue'
import Wireless from './components/Wireless/index.vue'
import TerminalAction from './components/TerminalAction/index.vue'
import MirrorAction from './components/MirrorAction/index.vue'
import MoreDropdown from './components/MoreDropdown/index.vue'
import WirelessAction from './components/WirelessAction/index.vue'

import { isIPWithPort, sleep } from '$/utils/index.js'

export default {
  components: {
    Wireless,
    ControlBar,
    Remark,
    TerminalAction,
    MirrorAction,
    MoreDropdown,
    WirelessAction,
  },
  data() {
    return {
      loading: false,
      deviceList: [],
      mirrorActionRefs: [],
    }
  },
  async created() {
    this.getDeviceData()
    this.unAdbWatch = await this.$adb.watch(this.onAdbWatch)
  },
  beforeUnmount() {
    this?.unAdbWatch?.()
  },
  methods: {
    async onAdbWatch(type, ret) {
      if (ret && ret.id) {
        this.getDeviceData()
      }

      if (type === 'add' && !isIPWithPort(ret.id) && ret.$host) {
        this.formData = {
          ...this.formData,
          host: ret.$host,
        }
      }

      if (type === 'remove') {
        this.mirrorActionRefs = this.mirrorActionRefs.filter(
          item => item.row.id !== ret.id,
        )
      }
    },
    async getMirrorActionRefs(ref, index) {
      await this.$nextTick()

      if (!ref?.row?.id) {
        return false
      }

      const someFlag = this.mirrorActionRefs.some(
        item => item.row.id === ref.row.id,
      )

      if (someFlag) {
        return false
      }

      this.mirrorActionRefs.push(ref)

      const secondNum = index

      await sleep(secondNum * 2000)

      const autoMirror = this.$store.preference.data.autoMirror

      if (autoMirror) {
        ref.handleClick(ref.row)
      }
    },

    toggleRowExpansion(...args) {
      this.$refs.elTable.toggleRowExpansion(...args)
    },

    handleConnect(...args) {
      this.$refs.wireless.connect(...args)
    },

    handleRefresh() {
      this.getDeviceData({ resetResolve: true })
    },

    async handleReset() {
      try {
        await this.$confirm(
          `
          <div>${this.$t('device.reset.reasons[0]')}</div>
          <div class="text-red-500">${this.$t('device.reset.reasons[1]')}</div>
          `,
          this.$t('device.reset.title'),
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('device.reset.confirm'),
            cancelButtonText: this.$t('device.reset.cancel'),
            closeOnClickModal: false,
            type: 'warning',
          },
        )

        this.$store.preference.reset()

        this.$root.reRender('Preference')

        this.$message.success(this.$t('device.reset.success'))
      }
      catch (error) {
        if (error.message) {
          console.warn(error.message)
        }
      }
    },

    handleRestart() {
      this.$electron.ipcRenderer.send('restart-app')
    },

    handleLog() {
      this.$appLog.openInEditor()
    },

    async getDeviceData({ resetResolve = false } = {}) {
      this.loading = true

      await sleep(500)

      try {
        const data = await this.$store.device.getList()

        this.deviceList = data
      }
      catch (error) {
        console.warn(error)
        if (error?.message || error?.cause?.message) {
          this.$message.warning(error?.message || error?.cause?.message)
        }
        this.deviceList = []

        if (resetResolve) {
          this.handleReset()
        }
      }
      this.loading = false
    },
  },
}
</script>

<style lang="postcss" scoped>
:deep() {
  .el-table .el-table__row .cell {
    @apply py-1;
  }
}
</style>

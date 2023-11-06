<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center flex-none space-x-2">
      <Wireless ref="wireless" />

      <el-button
        type="primary"
        :icon="loading ? '' : 'Refresh'"
        :loading="loading"
        @click="handleRefresh"
      >
        {{ $t("device.refresh.name") }}
      </el-button>

      <el-button type="warning" icon="RefreshRight" @click="handleRestart">
        {{ $t("device.restart.name") }}
      </el-button>

      <el-button icon="View" @click="handleLog">
        {{ $t("device.log.name") }}
      </el-button>
    </div>
    <div class="pt-4 flex-1 h-0 overflow-hidden">
      <el-table
        ref="elTable"
        v-loading="loading"
        :element-loading-text="loadingText"
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
          :label="$t('device.control.name')"
          width="450"
          align="left"
        >
          <template #default="{ row }">
            <el-button
              :loading="row.$loading"
              type="primary"
              text
              :disabled="row.$unauthorized"
              :icon="row.$loading ? '' : 'Monitor'"
              @click="handleMirror(row)"
            >
              {{
                row.$loading
                  ? $t("device.mirror.progress")
                  : $t("device.mirror.start")
              }}
            </el-button>

            <el-button
              type="primary"
              text
              :loading="row.$recordLoading"
              :disabled="row.$unauthorized"
              :icon="row.$recordLoading ? '' : 'VideoCamera'"
              @click="handleRecord(row)"
            >
              {{
                row.$recordLoading
                  ? $t("device.record.progress")
                  : $t("device.record.start")
              }}
            </el-button>

            <el-button
              v-if="!row.$wifi"
              type="primary"
              text
              :disabled="
                row.$unauthorized || row.$loading || row.$recordLoading
              "
              @click="handleWifi(row)"
            >
              <template #icon>
                <svg-icon name="wifi"></svg-icon>
              </template>
              {{ $t("device.wireless.mode") }}
            </el-button>

            <el-button
              v-if="row.$wifi"
              type="danger"
              text
              :loading="row.$stopLoading"
              :disabled="row.$unauthorized"
              :icon="row.$stopLoading ? '' : 'CircleClose'"
              @click="handleStop(row)"
            >
              {{
                row.$stopLoading
                  ? $t("device.wireless.disconnect.progress")
                  : $t("device.wireless.disconnect.start")
              }}
            </el-button>
          </template>
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
import dayjs from 'dayjs'
import ControlBar from './components/ControlBar/index.vue'
import Remark from './components/Remark/index.vue'
import Wireless from './components/Wireless/index.vue'
import { isIPWithPort, sleep } from '@/utils/index.js'

export default {
  components: {
    Wireless,
    ControlBar,
    Remark,
  },
  data() {
    return {
      loading: false,
      loadingText: this.$t('device.list.loading'),
      deviceList: [],
    }
  },
  computed: {},
  async created() {
    this.getDeviceData()

    this.unAdbWatch = await this.$adb.watch(async (type, ret) => {
      console.log('adb.watch.ret', ret)

      if (ret && ret.id) {
        this.getDeviceData()
      }

      if (type === 'add' && !isIPWithPort(ret.id) && ret.$host) {
        this.formData = {
          ...this.formData,
          host: ret.$host,
        }
      }
    })
  },
  beforeUnmount() {
    this?.unAdbWatch?.()
  },
  methods: {
    onStdout() {},
    handleConnect(...args) {
      this.$refs.wireless.connect(...args)
    },
    preferenceData(...args) {
      return this.$store.preference.getData(...args)
    },
    scrcpyArgs(...args) {
      return this.$store.preference.getScrcpyArgs(...args)
    },
    handleRefresh() {
      this.getDeviceData({ resetResolve: true })
    },
    async handleReset(depType = 'scrcpy') {
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

        this.$store.preference.resetDeps(depType)

        this.$root.reRender('Preference')

        this.$message.success(this.$t('device.reset.success'))
      }
      catch (error) {
        if (error.message) {
          console.warn(error.message)
        }
      }
    },
    toggleRowExpansion(...params) {
      this.$refs.elTable.toggleRowExpansion(...params)
    },
    getRecordPath(row) {
      const rowConfig = this.preferenceData(row.id)
      const basePath = rowConfig.savePath

      const fileName = `${row.$remark ? `${row.$remark}-` : ''}${
        row.$name
      }-${this.$replaceIP(row.id)}-recording-${dayjs().format(
        'YYYY-MM-DD-HH-mm-ss',
      )}`

      const joinValue = this.$path.join(basePath, fileName)
      const value = this.$path.normalize(joinValue)

      return value
    },
    async handleRecord(row) {
      row.$recordLoading = true

      this.toggleRowExpansion(row, true)

      const savePath = this.getRecordPath(row)

      try {
        await this.$scrcpy.record(row.id, {
          title: `${row.$remark ? `${row.$remark}-` : ''}${row.$name}-${
            row.id
          }-🎥${this.$t('device.record.progress')}...`,
          savePath,
          args: this.scrcpyArgs(row.id, { isRecord: true }),
          stdout: this.onStdout,
        })

        await this.$confirm(
          this.$t('device.record.success.message'),
          this.$t('device.record.success.title'),
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
      row.$recordLoading = false
    },
    async handleMirror(row) {
      row.$loading = true

      this.toggleRowExpansion(row, true)

      try {
        await this.$scrcpy.mirror(row.id, {
          title: `${row.$remark ? `${row.$remark}-` : ''}${row.$name}-${
            row.id
          }`,
          args: this.scrcpyArgs(row.id),
          stdout: this.onStdout,
        })
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
        this.handleReset()
      }
      row.$loading = false
    },
    async handleWifi(row) {
      try {
        const host = await this.$adb.getDeviceIP(row.id)

        if (!host) {
          throw new Error(this.$t('device.wireless.mode.error'))
        }

        const port = await this.$adb.tcpip(row.id, 5555)

        await sleep()

        console.log('host:port', `${host}:${port}`)

        this.handleConnect({
          host,
          port,
        })
      }
      catch (error) {
        console.warn(error.message)
        if (error?.message || error?.cause?.message) {
          this.$message.warning(error?.message || error?.cause?.message)
        }
      }
    },

    handleRestart() {
      this.$electron.ipcRenderer.send('restart-app')
    },
    handleLog() {
      this.$appLog.openInEditor()
    },

    async handleStop(row) {
      row.$stopLoading = true
      const [host, port] = row.id.split(':')
      try {
        await this.$adb.disconnect(host, port)
        await sleep()
        this.$message.success(this.$t('device.wireless.disconnect.success'))
      }
      catch (error) {
        if (error.message)
          this.$message.warning(error.message)
      }
      row.$stopLoading = false
    },

    async getDeviceData({ resetResolve = false } = {}) {
      this.loading = true
      await sleep(500)
      try {
        const data = await this.$store.device.getList()
        this.deviceList
          = data?.map(item => ({
            ...item,
            $loading: false,
            $recordLoading: false,
            $stopLoading: false,
          })) || []

        console.log('getDeviceData.data', this.deviceList)
      }
      catch (error) {
        console.warn(error)
        if (error?.message || error?.cause?.message) {
          this.$message.warning(error?.message || error?.cause?.message)
        }
        this.deviceList = []

        if (resetResolve) {
          this.handleReset('adb')
        }
      }
      this.loading = false
      this.loadingText = ''
    },
  },
}
</script>

<style></style>

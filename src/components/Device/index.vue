<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center flex-none space-x-2">
      <el-input
        v-model="formData.host"
        placeholder="192.168.0.1"
        class="!w-86 flex-none"
        clearable
      >
        <template #prepend>
          无线连接
        </template>
      </el-input>
      <div class="text-gray-500 text-sm">
        :
      </div>
      <el-input
        v-model.number="formData.port"
        type="number"
        placeholder="5555"
        :min="0"
        clearable
        class="!w-32 flex-none"
      >
      </el-input>

      <el-button
        type="primary"
        :icon="connectLoading ? '' : 'Connection'"
        :loading="connectLoading"
        @click="handleConnect"
      >
        连接设备
      </el-button>
      <el-button
        type="primary"
        :icon="loading ? '' : 'Refresh'"
        :loading="loading"
        @click="getDeviceData"
      >
        刷新设备
      </el-button>
      <el-button type="warning" icon="RefreshRight" @click="handleReset">
        重启服务
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
          <el-empty description="设备列表为空" />
        </template>
        <el-table-column
          prop="id"
          label="设备 ID"
          show-overflow-tooltip
          align="left"
          width="200"
        />
        <el-table-column
          prop="name"
          label="设备名称"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <div class="flex items-center">
              <el-tooltip
                v-if="row.$unauthorized"
                content="设备可能未授权成功，请重新插拔设备并点击允许USB调试"
                placement="top-start"
              >
                <el-icon class="mr-1 text-red-600 text-lg">
                  <WarningFilled />
                </el-icon>
              </el-tooltip>

              {{ row.name }}

              <el-tag v-if="row.$wifi" effect="light" class="ml-2">
                WIFI
              </el-tag>

              <Remark :device="row" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="left">
          <template #default="{ row }">
            <el-button
              type="primary"
              text
              :loading="row.$loading"
              :disabled="row.$unauthorized"
              :icon="row.$loading ? '' : 'Monitor'"
              @click="handleMirror(row)"
            >
              {{ row.$loading ? "正在镜像" : "开始镜像" }}
            </el-button>

            <el-button
              type="primary"
              text
              :loading="row.$recordLoading"
              :disabled="row.$unauthorized"
              :icon="row.$recordLoading ? '' : 'VideoCamera'"
              @click="handleRecord(row)"
            >
              {{ row.$recordLoading ? "正在录制" : "开始录制" }}
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
              无线模式
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
              {{ row.$stopLoading ? "正在断开" : "断开连接" }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template #header>
            <el-icon class="" title="设备交互">
              <Operation class="" />
            </el-icon>
          </template>
          <template #default="{ row }">
            <ControlBar :device="row" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <PairDialog ref="pairDialog" @success="onPairSuccess" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import PairDialog from './PairDialog/index.vue'
import ControlBar from './ControlBar/index.vue'
import Remark from './Remark/index.vue'
import storage from '@/utils/storages'
import { isIPWithPort, sleep } from '@/utils/index.js'

export default {
  components: {
    PairDialog,
    ControlBar,
    Remark,
  },
  data() {
    const adbCache = storage.get('adbCache') || {}
    return {
      loading: false,
      loadingText: '努力加载中...',
      connectLoading: false,
      deviceList: [],
      formData: {
        host: adbCache.host,
        port: adbCache.port,
      },
    }
  },
  computed: {
    scrcpyConfig() {
      return this.$store.scrcpy.config
    },
    stringScrcpyConfig() {
      return this.$store.scrcpy.stringConfig
    },
  },
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
    if (this.unAdbWatch) {
      this.unAdbWatch()
    }
  },
  methods: {
    onStdout() {},
    toggleRowExpansion(...params) {
      this.$refs.elTable.toggleRowExpansion(...params)
    },
    getRecordPath(row) {
      const basePath = this.scrcpyConfig.savePath
      const recordFormat = this.scrcpyConfig['--record-format']
      const fileName = `${row.name || row.id}-recording-${dayjs().format(
        'YYYY-MM-DD-HH-mm-ss',
      )}.${recordFormat}`
      const joinValue = this.$path.join(basePath, fileName)
      const value = this.$path.normalize(joinValue)
      return value
    },
    async handleRecord(row) {
      row.$recordLoading = true

      this.toggleRowExpansion(row, true)

      const savePath = this.getRecordPath(row)
      try {
        const command = `--serial=${row.id} --window-title=${
          row.$remark ? `${row.$remark}-` : ''
        }${row.name}-${row.id}-🎥录制中... --record=${savePath} ${
          this.stringScrcpyConfig
        }`

        console.log('handleRecord.command', command)

        await this.$scrcpy.shell(command, { stdout: this.onStdout })

        await this.$confirm('是否前往录制位置进行查看？', '录制成功', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'success',
        })

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
        await this.$scrcpy.shell(
          `--serial=${row.id} --window-title=${
            row.$remark ? `${row.$remark}-` : ''
          }${row.name}-${row.id} ${this.stringScrcpyConfig}`,
          { stdout: this.onStdout },
        )
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }
      row.$loading = false
    },
    async handleWifi(row) {
      try {
        const host = await this.$adb.getDeviceIP(row.id)
        const port = await this.$adb.tcpip(row.id, 5555)
        this.formData.host = host
        this.formData.port = port
        console.log('host:port', `${host}:${port}`)
        await sleep()

        this.handleConnect()
      }
      catch (error) {
        console.warn(error.message)
      }
    },
    onPairSuccess() {
      this.handleConnect()
    },
    handleReset() {
      this.$electron.ipcRenderer.send('restart-app')
    },
    async handleConnect() {
      if (!this.formData.host) {
        this.$message.warning('无线调试地址不能为空')
        return false
      }

      this.connectLoading = true
      try {
        await this.$adb.connect(this.formData.host, this.formData.port || 5555)
        this.$message.success('连接设备成功')
        storage.set('adbCache', this.formData)
      }
      catch (error) {
        this.handleError(error.message)
      }
      this.connectLoading = false
    },
    async handleError(message) {
      try {
        await this.$confirm(
          `
        <div class="pb-4 text-sm text-red-500">错误详情：${message}</div>
        <div>可能有以下原因：</div>
        <div>1. IP地址或端口号错误</div>
        <div>2. 设备未与当前电脑配对成功</div>
        <div>3. 电脑网络和提供的设备网络IP不在同一个局域网中</div>
        <div>4. 其他未知错误</div>
        `,
          '连接设备失败',
          {
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false,
            confirmButtonText: '无线配对',
            cancelButtonText: '取消',
            type: 'warning',
          },
        )
        this.$refs.pairDialog.show({ params: { ...this.formData } })
      }
      catch (error) {
        console.warn(error.message)
      }
    },
    async handleStop(row) {
      row.$stopLoading = true
      const [host, port] = row.id.split(':')
      try {
        await this.$adb.disconnect(host, port)
        await sleep()
        this.$message.success('断开连接成功')
      }
      catch (error) {
        if (error.message)
          this.$message.warning(error.message)
      }
      row.$stopLoading = false
    },

    async getDeviceData() {
      this.loading = true
      await sleep()
      try {
        const data = await this.$adb.getDevices()
        this.deviceList
          = data?.map(item => ({
            ...item,
            id: item.id,
            name: item.model ? item.model.split(':')[1] : '未授权设备',
            $loading: false,
            $recordLoading: false,
            $stopLoading: false,
            $unauthorized: item.type === 'unauthorized',
            $wifi: isIPWithPort(item.id),
            $remark: this.$store.device.getRemark(item.id),
          })) || []

        console.log('getDeviceData.data', this.deviceList)
      }
      catch (error) {
        console.warn(error)
        if (error?.message || error?.cause?.message) {
          this.$message.warning(error?.message || error?.cause?.message)
        }
        this.deviceList = []
      }
      this.loading = false
      this.loadingText = '正在获取设备列表...'
    },
  },
}
</script>

<style></style>

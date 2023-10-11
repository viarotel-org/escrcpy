<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center flex-none space-x-2">
      <el-input v-model="formData.host" placeholder="192.168.0.1" class="w-86 flex-none" clearable>
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
        class="w-32 flex-none"
      >
      </el-input>

      <el-button type="primary" :loading="connectLoading" @click="handleConnect">
        连接设备
      </el-button>
      <el-button type="primary" :loading="loading" @click="getDeviceData">
        刷新设备
      </el-button>
      <el-button type="warning" @click="handleReset">
        重启服务
      </el-button>
    </div>
    <div class="pt-4 flex-1 h-0 overflow-hidden">
      <el-table
        v-loading="loading"
        :element-loading-text="loadingText"
        :data="deviceList"
        style="width: 100%"
        border
        height="100%"
      >
        <template #empty>
          <el-empty description="设备列表为空" />
        </template>
        <el-table-column prop="id" label="设备 ID" show-overflow-tooltip />
        <el-table-column prop="name" label="设备名称" show-overflow-tooltip>
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

              <el-tag v-if="row.$wireless" type="primary" effect="light" class="ml-2">
                WIFI
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="left">
          <template #default="{ row }">
            <el-button
              type="primary"
              :loading="row.$loading"
              :disabled="row.$unauthorized"
              @click="handleMirror(row)"
            >
              {{ row.$loading ? '镜像中' : '开始镜像' }}
            </el-button>
            <el-button
              v-if="!row.$wireless"
              type="primary"
              :disabled="row.$unauthorized"
              @click="handleWifi(row)"
            >
              无线模式
            </el-button>
            <el-button type="default" :disabled="row.$unauthorized" @click="handleScreenUp(row)">
              点亮屏幕
            </el-button>
            <el-button
              v-if="row.$wireless"
              type="danger"
              :loading="row.$stopLoading"
              :disabled="row.$unauthorized"
              @click="handleStop(row)"
            >
              {{ row.$stopLoading ? '断开中' : '断开连接' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <PairDialog ref="pairDialog" @success="onPairSuccess" />
  </div>
</template>

<script>
import { isIPWithPort, sleep } from '@renderer/utils/index.js'
import storage from '@renderer/utils/storages'
import PairDialog from './PairDialog/index.vue'

export default {
  components: {
    PairDialog,
  },
  data() {
    const adbCache = storage.get('adbCache') || {}
    return {
      loading: false,
      loadingText: '初始化中...',
      connectLoading: false,
      deviceList: [],
      formData: {
        host: adbCache.host,
        port: adbCache.port,
      },
    }
  },
  created() {
    this.getDeviceData()
    this.$adb.watch(async (type, ret) => {
      console.log('adb.watch.ret', ret)

      this.getDeviceData()

      if (type === 'add' && !isIPWithPort(ret.id)) {
        this.formData = {
          ...this.formData,
          host: ret.$host,
        }
      }
    })
  },
  methods: {
    async handleWifi(row) {
      try {
        const host = await this.$adb.getDeviceIP(row.id)
        const port = await this.$adb.tcpip(row.id, 5555)
        this.formData.host = host
        this.formData.port = port
        console.log('host:port', `${host}:${port}`)

        this.handleConnect()
      }
      catch (error) {
        console.warn(error.message)
      }
    },
    onPairSuccess() {
      this.handleConnect()
    },
    handleScreenUp(row) {
      this.$adb.deviceShell(row.id, 'input keyevent KEYCODE_POWER')
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
    async handleMirror(row) {
      row.$loading = true
      try {
        await this.$scrcpy.shell(
          `--serial=${row.id} --window-title=${row.name}-${row.id} ${this.addScrcpyConfigs()}`,
        )
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
        }
      }
      row.$loading = false
    },
    addScrcpyConfigs() {
      const configs = storage.get('scrcpyCache') || {}
      const value = Object.entries(configs)
        .reduce((arr, [key, value]) => {
          if (!value) {
            return arr
          }
          if (typeof value === 'boolean') {
            arr.push(key)
          }
          else {
            arr.push(`${key}=${value}`)
          }
          return arr
        }, [])
        .join(' ')

      console.log('addScrcpyConfigs.value', value)

      return value
    },
    async getDeviceData() {
      this.loading = true
      await sleep()
      try {
        const data = await this.$adb.getDevices()
        this.deviceList = (data || []).map(item => ({
          ...item,
          name: item.model ? item.model.split(':')[1] : '未授权设备',
          $loading: false,
          $stopLoading: false,
          $unauthorized: item.type === 'unauthorized',
          $wireless: isIPWithPort(item.id),
        }))

        console.log('getDeviceData.data', this.deviceList)
      }
      catch (error) {
        if (error.message) {
          this.$message.warning(error.message)
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

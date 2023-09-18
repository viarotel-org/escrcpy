<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center flex-none space-x-2">
      <el-input v-model="formData.host" placeholder="192.168.0.1" class="w-86" clearable>
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
        class="w-32"
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
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template #default="{ row }">
            <el-button type="primary" :loading="row.$loading" @click="handleMirror(row)">
              {{ row.$loading ? '镜像中' : '开始镜像' }}
            </el-button>
            <el-button type="default" @click="handleScreenUp(row)">
              点亮屏幕
            </el-button>
            <el-button
              v-if="row.$wireless"
              type="danger"
              :loading="row.$stopLoading"
              @click="handleStop(row)"
            >
              {{ row.$stopLoading ? '断开中' : '断开连接' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { isIPWithPort, sleep } from '@renderer/utils/index.js'
import storage from '@renderer/utils/storages'

export default {
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

    this.$adb.watch(() => {
      this.getDeviceData()
    })
  },
  methods: {
    handleScreenUp(row) {
      this.$adb.shell(row.id, 'input keyevent KEYCODE_POWER')
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
        if (error.message)
          this.$message.warning(error.message)
      }
      this.connectLoading = false
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
        await this.$scrcpy.shell(`--serial=${row.id} ${this.addScrcpyConfigs()}`)
      }
      catch (error) {
        this.$message.warning(error.message)
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
        if (error.message)
          this.$message.warning(error.message)
        this.deviceList = []
      }
      this.loading = false
      this.loadingText = '正在获取设备列表...'
    },
  },
}
</script>

<style></style>

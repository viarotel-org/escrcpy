<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center flex-none">
      <el-button type="primary" @click="getDeviceData">
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
        <el-table-column prop="id" label="设备 ID" />
        <el-table-column prop="name" label="设备名称">
          <template #default="{ row }">
            <div v-if="row.$unauthorized" class="flex items-center">
              <el-tooltip content="请重新插拔设备并点击允许USB调试" placement="top-start">
                <el-icon class="mr-1 text-red-600 text-lg">
                  <WarningFilled />
                </el-icon>
              </el-tooltip>
              设备未授权
            </div>
            <span v-else class="">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template #default="{ row }">
            <el-button type="primary" :loading="row.$loading" @click="handleStart(row)">
              {{ row.$loading ? '镜像中' : '开始镜像' }}
            </el-button>
            <el-button
              :disabled="!row.$loading"
              type="default"
              @click="handleScreenUp(row)"
            >
              点亮屏幕
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { isIPWithPort, sleep } from '@renderer/utils/index.js'

export default {
  data() {
    return {
      loading: false,
      loadingText: '初始化中...',
      deviceList: [],
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
    async handleStart(row) {
      row.$loading = true
      try {
        await this.$scrcpy.shell(`-s ${row.id}`)
      }
      catch (error) {
        if (error.message)
          this.$message.warning(error.message)
      }
      row.$loading = false
    },
    async getDeviceData() {
      this.loading = true
      await sleep(500)
      try {
        const data = await this.$adb.getDevices()
        this.deviceList = (data || [])
          .filter(item => !isIPWithPort(item.id))
          .map(item => ({
            ...item,
            name: item.model ? item.model.split(':')[1] : '未授权设备',
            $loading: false,
            $unauthorized: item.type === 'unauthorized',
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

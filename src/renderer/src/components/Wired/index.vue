<template>
  <div class="">
    <div class="flex">
      <el-button type="primary" @click="handleFind">
        刷新设备
      </el-button>
      <el-button type="warning" :loading="stopLoading" @click="handleReset">
        {{ stopLoading ? '重置服务中' : '重置服务' }}
      </el-button>
    </div>
    <div class="pt-4">
      <el-table v-loading="loading" :data="deviceList" style="width: 100%" border>
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
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" :loading="row.$loading" @click="handleStart(row)">
              {{ row.$loading ? '运行中' : '连接设备' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { sleep } from '@renderer/utils/index.js'

export default {
  data() {
    return {
      loading: false,
      stopLoading: false,
      deviceList: [],
    }
  },
  created() {
    this.getDeviceData()
  },
  methods: {
    async handleStart(row) {
      row.$loading = true
      try {
        await this.$scrcpy.shell(`-s ${row.id}`)
      }
      catch (error) {
        this.$message.error(`${error.message}`)
      }
      row.$loading = false
    },
    async getDeviceData() {
      this.loading = true
      await sleep(500)
      try {
        const data = await this.$adb.getDevices().catch(e => console.warn(e))
        console.log('getDeviceData.data', data)
        this.deviceList = data.map(item => ({
          ...item,
          name: item.model ? item.model.split(':')[1] : '未授权设备',
          $loading: false,
          $unauthorized: item.type === 'unauthorized',
        }))
      }
      catch (error) {
        console.warn('error', error.message)
      }
      this.loading = false
    },
    handleFind() {
      this.getDeviceData()
    },
    async handleReset() {
      this.stopLoading = true
      try {
        await this.$adb.kill()
        await sleep(2000)
      }
      catch (error) {
        console.warn('error', error.message)
      }
      this.stopLoading = false
      this.$message.success('重置服务状态成功')
      this.handleFind()
    },
  },
}
</script>

<style></style>

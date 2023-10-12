<template>
  <div class="flex flex-col items-center justify-center h-full -mt-8">
    <div class="">
      <img src="@renderer/assets/icon.png" class="h-48" alt="" />
    </div>
    <div class="pt-4 text-xl text-center italic text-gray-700">
      📱 使用图形化的
      <a class="hover:underline text-primary-500" :href="escrcpyURL" target="_blank">Scrcpy</a>
      显示和控制您的 Android 设备，由 Electron 驱动
    </div>
    <div class="pt-12 pb-4">
      <el-button :loading="loading" type="primary" size="large" @click="handleUpdate">
        {{ loading && percent ? `正在更新中...（${percent.toFixed(1)}%）` : '版本检测更新' }}
      </el-button>
    </div>
    <div class="text-sm">
      Supported by
      <a class="hover:underline text-primary-500" href="https://viarotel.github.io/" target="_blank">Viarotel</a>
      v{{ version }}
    </div>
  </div>
</template>

<script>
import { version } from '@root/package.json'

export default {
  data() {
    return {
      loading: false,
      version,
      percent: 0,
      escrcpyURL: 'https://github.com/viarotel-org/escrcpy',
    }
  },
  created() {
    this.onUpdateNotAvailable()
    this.onUpdateAvailable()
    this.onDownloadProgress()
    this.onUpdateDownloaded()
    this.onUpdateError()
  },
  methods: {
    handleUpdate() {
      this.loading = true
      this.$electron.ipcRenderer.send('check-for-update')
    },
    onUpdateNotAvailable() {
      this.$electron.ipcRenderer.on('update-not-available', () => {
        this.loading = false
        this.$message.success('已经是最新版本')
      })
    },
    onUpdateError() {
      this.$electron.ipcRenderer.on('update-error', async (event, ret) => {
        this.loading = false
        console.log('ret', ret)
        try {
          await this.$confirm(
            '你可能需要科学上网，是否前往发布页面手动下载更新？',
            '检查更新失败',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'error',
            },
          )
          window.open(`${this.escrcpyURL}/releases`)
        }
        catch (error) {
          console.warn(error.message)
        }
      })
    },
    onDownloadProgress() {
      this.$electron.ipcRenderer.on('download-progress', async (event, ret) => {
        console.log('ret', ret)
        this.percent = ret.percent
      })
    },
    async onUpdateDownloaded() {
      this.$electron.ipcRenderer.on('update-downloaded', async (event, ret) => {
        console.log('ret', ret)
        this.loading = false
        try {
          await this.$confirm('是否立即重启更新？', '下载新版本成功', {
            confirmButtonText: '更新',
            cancelButtonText: '取消',
            closeOnClickModal: false,
          })
          this.$electron.ipcRenderer.send('quit-and-install')
        }
        catch (error) {
          console.warn(error.message)
        }
      })
    },
    onUpdateAvailable() {
      this.$electron.ipcRenderer.on('update-available', async (event, ret) => {
        this.loading = false
        try {
          console.log('ret', ret)
          await this.$confirm(ret.releaseNotes, '发现新版本', {
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false,
            confirmButtonText: '更新',
            cancelButtonText: '取消',
          })
          this.$electron.ipcRenderer.send('download-update')
          this.loading = true
        }
        catch (error) {
          console.warn(error.message)
        }
      })
    },
  },
}
</script>

<style></style>

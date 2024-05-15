<template>
  <div class="flex flex-col items-center justify-center h-full -mt-8">
    <a class="block" :href="escrcpyURL" target="_blank">
      <img src="$electron/resources/build/logo.png" class="h-48" alt="" />
    </a>

    <div class="pt-4 text-xl text-center italic text-gray-700 dark:text-white">
      {{ $t("about.description") }}
    </div>

    <div class="pt-12 pb-4">
      <el-button
        :loading="loading"
        type="primary"
        size="large"
        @click="handleUpdate"
      >
        {{
          loading && percent
            ? `${$t("about.update.progress")}...（${percent.toFixed(1)}%）`
            : $t("about.update")
        }}
      </el-button>
    </div>

    <div class="text-sm">
      Supported by

      <a
        class="hover:underline text-primary-500"
        href="https://viarotel.github.io/"
        target="_blank"
      >Viarotel</a>

      v{{ version }}
    </div>
  </div>
</template>

<script>
import { version } from '/package.json'

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
        this.$message.success(this.$t('about.update-not-available'))
      })
    },
    onUpdateError() {
      this.$electron.ipcRenderer.on('update-error', async (_, ret) => {
        this.loading = false
        try {
          await this.$confirm(
            this.$t('about.update-error.message'),
            this.$t('about.update-error.title'),
            {
              confirmButtonText: this.$t('common.confirm'),
              cancelButtonText: this.$t('common.cancel'),
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
        this.percent = ret.percent
      })
    },
    async onUpdateDownloaded() {
      this.$electron.ipcRenderer.on('update-downloaded', async (event, ret) => {
        this.loading = false
        try {
          await this.$confirm(
            this.$t('about.update-downloaded.message'),
            this.$t('about.update-downloaded.title'),
            {
              confirmButtonText: this.$t('about.update-downloaded.confirm'),
              cancelButtonText: this.$t('common.cancel'),
              closeOnClickModal: false,
            },
          )
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
          await this.$confirm(
            ret.releaseNotes,
            this.$t('about.update-available.title'),
            {
              dangerouslyUseHTMLString: true,
              closeOnClickModal: false,
              confirmButtonText: this.$t('about.update-available.confirm'),
              cancelButtonText: this.$t('common.cancel'),
            },
          )
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

<template>
  <div class="h-full">
    <div class="h-full flex flex-col items-center justify-center space-y-[4vh] -mt-[4vh]">
      <a class="block" :href="escrcpyURL" target="_blank">
        <img src="$electron/resources/build/logo.png" class="h-[32vh] max-h-72" alt="" />
      </a>

      <div class="text-lg lg:text-xl xl:text-2xl text-center italic text-gray-700 dark:text-white">
        {{ $t("about.description") }}
      </div>

      <div class="pt-[4vh]">
        <el-button
          :loading="loading"
          type="primary"
          :size="$grid.lg ? 'large' : 'default'"
          @click="handleUpdate"
        >
          {{
            loading && percent
              ? `${$t("about.update.progress")}...（${percent.toFixed(1)}%）`
              : $t("about.update")
          }}
        </el-button>

        <el-button :size="$grid.lg ? 'large' : 'default'" class="group" @click="handleSponsor">
          <span class="group-hover:animate-rubber-band text-red-500">♥</span>
          <span class="pl-1">{{ $t('about.sponsor.title') }}</span>
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

    <SponsorDialog ref="sponsorDialogRef" />
  </div>
</template>

<script>
import { version } from '/package.json'
import SponsorDialog from './components/SponsorDialog/index.vue'

export default {
  name: 'About',
  components: {
    SponsorDialog,
  },
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
    handleSponsor() {
      this.$refs.sponsorDialogRef.open()
    },
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

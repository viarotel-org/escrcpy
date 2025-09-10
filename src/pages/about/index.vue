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

        <el-button :size="$grid.lg ? 'large' : 'default'" class="group" @click="onClickDocs">
          <span class="pl-1">{{ $t('about.docs.name') }}</span>
        </el-button>

        <el-button :size="$grid.lg ? 'large' : 'default'" class="group" @click="onClickDonate">
          <span class="group-hover:animate-rubber-band text-red-500">♥</span>
          <span class="pl-1">{{ $t('about.donate.title') }}</span>
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

<script setup>
import { homepage, version } from '/package.json'
import SponsorDialog from './components/SponsorDialog/index.vue'
import { i18n } from '$/locales/index.js'

const loading = ref(false)
const percent = ref(0)
const escrcpyURL = homepage
const locale = i18n.global.locale

const { proxy } = getCurrentInstance()

function onClickDonate() {
  proxy.$refs.sponsorDialogRef.open()
}

function onClickDocs() {
  const localePath = {
    'zh-CN': 'zhHans',
  }[locale.value] || ''

  window.open(`https://viarotel.eu.org/${localePath}`)
}

function handleUpdate() {
  loading.value = true
  proxy.$electron.ipcRenderer.send('check-for-update')
}

function onUpdateNotAvailable() {
  proxy.$electron.ipcRenderer.on('update-not-available', () => {
    loading.value = false
    proxy.$message.success(proxy.$t('about.update-not-available'))
  })
}

function onDownloadProgress() {
  proxy.$electron.ipcRenderer.on('download-progress', (event, ret) => {
    percent.value = ret.percent
  })
}

function onUpdateDownloaded() {
  proxy.$electron.ipcRenderer.on('update-downloaded', async () => {
    loading.value = false
    try {
      await proxy.$confirm(
        proxy.$t('about.update-downloaded.message'),
        proxy.$t('about.update-downloaded.title'),
        {
          confirmButtonText: proxy.$t('about.update-downloaded.confirm'),
          cancelButtonText: proxy.$t('common.cancel'),
          closeOnClickModal: false,
        },
      )
      proxy.$electron.ipcRenderer.send('quit-and-install')
    }
    catch (error) {
      console.warn(error.message)
    }
  })
}

function onUpdateError() {
  proxy.$electron.ipcRenderer.on('update-error', async (_, ret) => {
    loading.value = false
    try {
      await proxy.$confirm(
        proxy.$t('about.update-error.message'),
        proxy.$t('about.update-error.title'),
        {
          closeOnClickModal: false,
          type: 'error',
        },
      )
      window.open(`${escrcpyURL}/releases`)
    }
    catch (error) {
      console.warn(error.message)
    }
  })
}

function onUpdateAvailable() {
  proxy.$electron.ipcRenderer.on('update-available', async (_, ret) => {
    loading.value = false
    try {
      await proxy.$confirm(
        ret.releaseNotes,
        proxy.$t('about.update-available.title'),
        {
          dangerouslyUseHTMLString: true,
          closeOnClickModal: false,
          confirmButtonText: proxy.$t('about.update-available.confirm'),
          cancelButtonText: proxy.$t('common.cancel'),
        },
      )
      proxy.$electron.ipcRenderer.send('download-update')
      loading.value = true
    }
    catch (error) {
      console.warn(error.message)
    }
  })
}

onMounted(() => {
  onUpdateNotAvailable()
  onUpdateAvailable()
  onDownloadProgress()
  onUpdateDownloaded()
  onUpdateError()
})
</script>

<style></style>

<template>
  <div class="h-full">
    <div class="h-full flex flex-col items-center justify-center space-y-[4vh] -mt-[4vh]">
      <a class="block" :href="escrcpyURL" target="_blank">
        <img src="$electron/resources/build/logo.png" class="h-[32vh] max-h-72 drop-shadow drop-shadow-color-gray-300" alt="" />
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

        <el-button :size="$grid.lg ? 'large' : 'default'" class="group" @click="onDocsClick">
          <span class="pl-1">{{ $t('about.docs.name') }}</span>
        </el-button>

        <el-button :size="$grid.lg ? 'large' : 'default'" class="group" @click="onDonateClick">
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
    <UpdateDialog ref="updateDialogRef" />
  </div>
</template>

<script setup>
import { homepage, version } from '/package.json'
import SponsorDialog from './components/sponsor-dialog/index.vue'
import UpdateDialog from './components/update-dialog/index.vue'

const loading = ref(false)
const percent = ref(0)
const escrcpyURL = homepage
const { language: locale } = useI18n()

const docsUrl = computed(() => {
  const localePath = {
    'zh-CN': 'zhHans/',
  }[locale.value] || ''

  return `https://viarotel.eu.org/${localePath}`
})

const sponsorDialogRef = ref()
const updateDialogRef = ref()

function onDonateClick() {
  sponsorDialogRef.value.open()
}

function onDocsClick() {
  window.open(docsUrl.value)
}

function handleUpdate() {
  loading.value = true
  window.$preload.ipcRenderer.send('check-for-update')
}

function onUpdateNotAvailable() {
  window.$preload.ipcRenderer.on('update-not-available', () => {
    loading.value = false
    ElMessage.success(window.t('about.update-not-available'))
  })
}

function onDownloadProgress() {
  window.$preload.ipcRenderer.on('download-progress', (event, ret) => {
    percent.value = ret.percent
  })
}

function onUpdateDownloaded() {
  window.$preload.ipcRenderer.on('update-downloaded', async () => {
    loading.value = false
    try {
      await ElMessageBox.confirm(
        window.t('about.update-downloaded.message'),
        window.t('about.update-downloaded.title'),
        {
          confirmButtonText: window.t('about.update-downloaded.confirm'),
          cancelButtonText: window.t('common.cancel'),
          closeOnClickModal: false,
        },
      )
      window.$preload.ipcRenderer.send('quit-and-install')
    }
    catch (error) {
      console.warn(error.message)
    }
  })
}

function onUpdateError() {
  window.$preload.ipcRenderer.on('update-error', async (_, ret) => {
    loading.value = false
    try {
      await ElMessageBox.confirm(
        window.t('about.update-error.message'),
        window.t('about.update-error.title'),
        {
          closeOnClickModal: false,
          type: 'error',
        },
      )
      window.open(`${docsUrl.value}/guide/started`)
    }
    catch (error) {
      console.warn(error.message)
    }
  })
}

function onUpdateAvailable() {
  window.$preload.ipcRenderer.on('update-available', async (_, ret) => {
    loading.value = false

    updateDialogRef.value.open({
      releaseNotes: ret.releaseNotes,
      onConfirm() {
        window.$preload.ipcRenderer.send('download-update')
        loading.value = true
      },
    })
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

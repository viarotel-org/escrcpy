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
          :loading="state.checking || state.downloading"
          type="primary"
          :size="$grid.lg ? 'large' : 'default'"
          @click="handleUpdate"
        >
          {{
            state.downloading && state.percent
              ? `${$t("about.update.progress")}...（${state.percent.toFixed(1)}%）`
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
  </div>
</template>

<script setup>
import { homepage, version } from '/package.json'
import SponsorDialog from './components/sponsor-dialog/index.vue'

const { state, checkForUpdate, openDialog } = useAppUpdate()

const escrcpyURL = homepage
const { language: locale } = useI18n()

const docsUrl = computed(() => {
  const localePath = {
    'zh-CN': 'zhHans/',
  }[locale.value] || ''

  return `https://viarotel.eu.org/${localePath}`
})

const sponsorDialogRef = ref()

function onDonateClick() {
  sponsorDialogRef.value.open()
}

function onDocsClick() {
  window.open(docsUrl.value)
}

function handleUpdate() {
  if (state.updateAvailable) {
    openDialog()
  }
  else {
    checkForUpdate()
  }
}
</script>

<style></style>

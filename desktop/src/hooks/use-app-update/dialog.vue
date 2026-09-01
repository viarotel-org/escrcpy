<template>
  <el-dialog
    v-model="state.dialogVisible"
    :title="$t('update.title')"
    fullscreen
    center
    destroy-on-close
    append-to-body
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen"
  >
    <div class="h-full overflow-auto">
      <div class="mx-auto max-w-2xl space-y-4 p-4">
        <el-card class="el-card--beautify" shadow="never">
          <div class="flex items-center text-center">
            <div class="flex-1 w-0">
              <el-statistic :title="$t('update.current-version')" :prefix="`v${currentVersion}`" :value="null" />
            </div>

            <div class="flex-1 w-0">
              <el-progress
                v-if="state.downloading"
                type="circle"
                :width="48"
                :percentage="state.percent"
                :status="state.error && !state.downloading ? 'exception' : ''"
                color="rgba(var(--color-primary-500), 1)"
                :format="(p) => `${p.toFixed(1)}%`"
              />

              <el-icon v-else>
                <el-icon-right />
              </el-icon>
            </div>

            <div class="flex-1 w-0">
              <el-statistic :title="$t('update.latest-version')" :prefix="`v${state.latestVersion}`" :value="null" />
            </div>
          </div>
        </el-card>

        <el-alert
          v-if="state.error && !state.downloading"
          type="error"
          show-icon
          :title="$t('update.check-failed')"
          :closable="false"
          class="!mb-4"
        />

        <div class="prose dark:prose-invert mx-auto" v-html="state.releaseNotes"></div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-center">
        <el-button @click="closeDialog">
          {{ $t('common.cancel') }}
        </el-button>

        <el-button v-if="$platform.is('macos')" type="primary" @click="openManualDownload">
          {{ $t('update.confirm') }}
        </el-button>

        <template v-else>
          <el-button @click="openManualDownload">
            {{ $t('update.manual-download') }}
          </el-button>

          <el-button
            v-if="!state.downloaded"
            type="primary"
            :loading="state.downloading"
            :disabled="state.checking"
            @click="startDownload"
          >
            {{ $t('update.confirm') }}
          </el-button>

          <el-button
            v-else
            type="primary"
            @click="installUpdate"
          >
            {{ $t('update.install') }}
          </el-button>
        </template>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const {
  state,
  currentVersion,
  closeDialog,
  startDownload,
  installUpdate,
  openManualDownload,
} = useAppUpdate()
</script>

<style></style>

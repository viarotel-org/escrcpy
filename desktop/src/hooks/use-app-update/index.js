import { version as currentVersion } from '/package.json'

// Module-level singleton state — shared across all consumers
const state = reactive({
  checking: false,
  updateAvailable: false,
  releaseNotes: '',
  latestVersion: '',
  downloading: false,
  percent: 0,
  downloaded: false,
  error: null,
  dialogVisible: false,
})

// Singleton guards
let initialized = false
let _silent = false

function getManualDownloadUrl() {
  const locale = navigator.language || 'en-US'
  const localePath = locale.startsWith('zh') ? 'zhHans/' : ''
  return `https://viarotel.eu.org/${localePath}guide/started`
}

function initListeners() {
  if (initialized) {
    return
  }

  initialized = true

  window.$preload.ipcRenderer.on('update-available', (_, ret) => {
    state.checking = false
    state.updateAvailable = true
    state.releaseNotes = ret.releaseNotes
    state.latestVersion = ret.version
    state.error = null

    if (!_silent) {
      state.dialogVisible = true
    }
    _silent = false
  })

  window.$preload.ipcRenderer.on('update-not-available', () => {
    state.checking = false

    if (!_silent) {
      ElMessage.success(window.t('update.not-available'))
    }
    _silent = false
  })

  window.$preload.ipcRenderer.on('download-progress', (_, ret) => {
    state.percent = ret.percent
  })

  window.$preload.ipcRenderer.on('update-downloaded', async () => {
    state.downloading = false
    state.downloaded = true
    state.percent = 100

    // When dialog is closed, show standalone confirm
    if (!state.dialogVisible) {
      try {
        await ElMessageBox.confirm(
          window.t('update.downloaded.message'),
          window.t('update.downloaded'),
          {
            confirmButtonText: window.t('update.downloaded.confirm'),
            cancelButtonText: window.t('common.cancel'),
            closeOnClickModal: false,
          },
        )
        window.$preload.ipcRenderer.send('quit-and-install')
      }
      catch (error) {
        console.warn(error.message)
      }
    }
  })

  window.$preload.ipcRenderer.on('update-error', async (_, error) => {
    state.checking = false
    state.downloading = false
    state.error = error

    if (_silent) {
      _silent = false
      return false
    }

    // When dialog is closed, show standalone error dialog
    if (!state.dialogVisible) {
      try {
        ElMessageBox.close()
        await ElMessageBox.confirm(
          window.t('update.check-failed.message'),
          window.t('update.check-failed'),
          {
            closeOnClickModal: false,
            type: 'error',
          },
        )
        window.open(getManualDownloadUrl())
      }
      catch (err) {
        console.warn(err.message)
      }
    }
  })
}

export function useAppUpdate() {
  initListeners()

  function checkForUpdate({ silent = false } = {}) {
    state.checking = true
    _silent = silent
    window.$preload.ipcRenderer.send('check-for-update')
  }

  function startDownload() {
    state.downloading = true
    state.percent = 0
    window.$preload.ipcRenderer.send('download-update')
  }

  function installUpdate() {
    window.$preload.ipcRenderer.send('quit-and-install')
  }

  function openManualDownload() {
    window.open(getManualDownloadUrl())
  }

  function openDialog() {
    state.dialogVisible = true
  }

  function closeDialog() {
    state.dialogVisible = false
  }

  return {
    state,
    currentVersion,
    checkForUpdate,
    startDownload,
    installUpdate,
    openManualDownload,
    openDialog,
    closeDialog,
  }
}

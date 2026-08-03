import { sleep } from '$/utils/index.js'
import { openFloatControl } from '$/utils/device/index.js'

const RECORD_MODELS = {
  default: {
    excludes: [],
    commands: [],
    extname: config => config['--record-format'] || 'mp4',
    label: 'Recording',
  },
  audio: {
    excludes: ['--video-source', '--no-audio', '--mouse'],
    commands: ['--no-video', '--mouse=disabled'],
    extname: config => config['--audio-record-format'] || 'opus',
    label: 'RecordingAudio',
  },
  camera: {
    excludes: ['--video-source', '--turn-screen-off', '--show-touches', '--no-power-on', '--stay-awake', '--power-off-on-close'],
    commands: ['--video-source=camera'],
    extname: config => config['--record-format'] || 'mp4',
    label: 'RecordingCamera',
  },
}

export function useRecordAction() {
  const loading = ref(false)

  async function invoke(input, options = {}) {
    const devices = Array.isArray(input) ? input : [input]
    const recordType = options.recordType || 'default'
    const activeModel = RECORD_MODELS[recordType] || RECORD_MODELS.default

    loading.value = true

    try {
      for (const device of devices.filter(Boolean)) {
        await recordDevice(device, activeModel, recordType, options)
        await sleep()
      }
    }
    finally {
      loading.value = false
    }
  }

  async function recordDevice(device, activeModel, recordType, options = {}) {
    const deviceStore = useDeviceStore()
    const preferenceStore = usePreferenceStore()

    const deviceId = device?.id || device
    const savePath = getRecordPath(device, activeModel)

    let args = preferenceStore.scrcpyParameter(deviceId, {
      useRecord: true,
      useCamera: recordType === 'camera',
      excludes: activeModel.excludes,
    })

    if (activeModel.commands.length) {
      args += ` ${activeModel.commands.join(' ')}`
    }

    const recording = window.$preload.scrcpy.record(deviceId, {
      title: deviceStore.getLabel(device, ({ appName, deviceName }) => `${appName}${activeModel.label}-${deviceName}`),
      savePath,
      args,
      ...options.scrcpyOptions,
    })

    if (recordType === 'default') {
      openFloatControl(toRaw(device))
    }

    try {
      await recording
      await window.$preload.ipcRenderer.invoke('copy-file-to-clipboard', savePath)
      ElMessage.success(window.t('device.record.success.title'))
    }
    catch (error) {
      console.error('record.args', args)
      console.error('record.error', error)

      if (error.message) {
        ElMessage.warning(error.message)
      }
    }
  }

  function getRecordPath(device, activeModel) {
    const deviceStore = useDeviceStore()
    const preferenceStore = usePreferenceStore()

    const deviceId = device?.id || device
    const deviceConfig = preferenceStore.getDataWithFallback(deviceId)
    const extension = activeModel.extname(deviceConfig)
    const fileName = deviceStore.getLabel(device, ({ currentTime, deviceName }) => `${activeModel.label}-${deviceName}-${currentTime}.${extension}`)
    const filePath = window.$preload.path.join(deviceConfig.savePath, fileName)

    return window.$preload.path.normalize(filePath)
  }

  const api = reactive({
    loading,
    invoke,
  })

  return api
}

export default useRecordAction

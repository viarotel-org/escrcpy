import { isEqual } from 'lodash-es'
import { ApiModelEnum } from '$copilot/dicts/api.js'

export const useCopilotStore = defineStore('app-copilot', () => {
  const defaultConfig = {
    provider: 'BigModel',
    baseUrl: ApiModelEnum.BigModel,
    model: ApiModelEnum.named.BigModel.label,
    apiKey: '',
    maxSteps: 50,
    lang: 'cn',
    quiet: false,
    prompts: [],
  }

  const config = ref({
    ...defaultConfig,
    ...(window.electronStore.get('copilot') ?? {}),
  })

  window.electronStore.onDidChange('copilot', (val) => {
    if (isEqual(val, config.value)) {
      return false
    }

    updateConfig(val)
  })

  function updateConfig(val = {}) {
    config.value = {
      ...toRaw(config.value),
      ...val,
    }

    window.electronStore.set('copilot', toRaw(config.value))
  }

  function switchGiteeConfig() {
    const subscribeStore = useSubscribeStore()

    updateConfig({
      provider: 'Gitee',
      baseUrl: ApiModelEnum.Gitee,
      model: ApiModelEnum.named.Gitee.label,
      apiKey: subscribeStore.accessToken,
    })
  }

  function resetConfig(options = {}) {
    if (options.source === 'store') {
      updateConfig(window.electronStore.get('copilot') ?? defaultConfig)
      return
    }

    updateConfig(defaultConfig)
  }

  return {
    defaultConfig,
    config,
    updateConfig,
    switchGiteeConfig,
    resetConfig,
  }
}, {
  persist: {
    paths: ['config'],
  },
})

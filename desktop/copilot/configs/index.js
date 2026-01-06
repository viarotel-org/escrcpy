import { ApiModelEnum } from '$copilot/dicts/api.js'

export const defaultCopilotConfigs = {
  provider: 'BigModel',
  baseUrl: ApiModelEnum.BigModel,
  model: ApiModelEnum.named.BigModel.label,
  apiKey: '',
  maxSteps: 50,
  lang: 'cn',
  quiet: false,
  prompts: [],
}

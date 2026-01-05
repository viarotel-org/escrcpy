import { ApiModelEnum } from '$copilot/dicts/api.js'

export const defaultCopilotConfigs = {
  provider: 'BigModel',
  baseUrl: ApiModelEnum.BigModel,
  model: ApiModelEnum.named.BigModel.label,
  apiKey: '',
  maxSteps: 50,
  lang: 'cn',
  quiet: false,
  prompts: [
    '打开微信',
    '打开支付宝扫码支付',
    '打开抖音并点赞第一个视频',
  ],
}

import { extraResolve } from '$electron/helpers/index.js'
import which from 'which'

export function getCopilotPath() {
  const whichPath = which.sync('copilot', { nothrow: true }) || void 0

  switch (process.platform) {
    case 'win32':
      return extraResolve('win/copilot')

    case 'darwin':
      return extraResolve(`mac-${process.arch}/copilot`)

    case 'linux':
      if (['arm64'].includes(process.arch)) {
        return extraResolve('linux-arm64/copilot')
      }
      return extraResolve('linux-x64/copilot')

    default:
      return whichPath
  }
}

export const copilotPath = getCopilotPath()

// Copilot 默认配置
export const copilotDefaultConfig = {
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  apiKey: '',
  model: 'autoglm-phone',
  prompts: [
    '打开微信',
    '打开支付宝扫码支付',
    '打开抖音并点赞第一个视频',
  ],
  maxSteps: 50,
  lang: 'cn',
  quiet: false,
}

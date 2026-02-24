import { Enum } from 'enum-plus'

export const ApiModelEnum = Enum({
  BigModel: {
    value: 'https://open.bigmodel.cn/api/paas/v4',
    label: 'autoglm-phone',
  },
  ModelScope: {
    value: 'https://api-inference.modelscope.cn/v1',
    label: 'ZhipuAI/AutoGLM-Phone-9B',
  },
  Gitee: {
    value: 'https://api.moark.com/v1',
    label: 'AutoGLM-Phone-9B-Multilingual',
  },
  Custom: {
    value: '',
    label: '',
  },
})

import { useI18n } from '$/hooks/useI18n/index.js'

export default {
  install(app) {
    const { t } = useI18n()

    window.t = t

    app.config.globalProperties.$t = t
  },
}

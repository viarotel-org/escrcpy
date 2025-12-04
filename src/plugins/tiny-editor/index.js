import TinyEditor from './components/TinyEditor/index.vue'

export default {
  install(app) {
    app.component('TinyEditor', TinyEditor)
  },
}

export { TinyEditor }


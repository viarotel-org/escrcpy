import useAutoImport from 'unplugin-auto-import/vite'
import useAutoComponents from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

import ElementPlus from './element-plus/auto.js'
import useElementPlusLocalDark from './element-plus/local-dark.js'

const resolvers = [ElementPlus()]

export default () => {
  return [
    useAutoImport({
      resolvers,
      imports: ['vue', 'pinia', '@vueuse/core', VueRouterAutoImports],
      eslintrc: {
        // This file is checked into the repository. Rewriting it on every
        // Vite startup occasionally fails on Windows when another watcher or
        // antivirus scanner opens it at the same time, aborting the whole dev
        // server with UNKNOWN/EPERM. Keep consuming the generated file without
        // touching it during normal development.
        enabled: false,
      },
      dirs: [
        'src/hooks/*/index.js',
        'src/store/*/*.js',
      ],
    }),
    useAutoComponents({
      resolvers,
      dirs: 'none',
    }),
    useElementPlusLocalDark(),
  ]
}

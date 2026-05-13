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
        enabled: true,
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

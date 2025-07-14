import useAutoImport from 'unplugin-auto-import/vite'
import useAutoComponents from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

import ElementPlus from './element-plus/auto.js'

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
        'src/store/*/index.js',
      ],
    }),
    useAutoComponents({
      resolvers,
      dirs: 'none',
    }),
  ]
}

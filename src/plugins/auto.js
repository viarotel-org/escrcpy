import useAutoImport from 'unplugin-auto-import/vite'
import useAutoComponents from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

import ElementPlus from './element-plus/auto.js'

const resolvers = [ElementPlus()]

export default () => {
  return [
    useAutoImport({
      resolvers,
      imports: ['vue', VueRouterAutoImports, 'pinia'],
      eslintrc: {
        enabled: true,
      },
    }),
    useAutoComponents({
      resolvers,
      dirs: 'none',
    }),
  ]
}

import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import useElectron from 'vite-plugin-electron'
import useRenderer from 'vite-plugin-electron-renderer'

import useVue from '@vitejs/plugin-vue'
import useEslint from 'vite-plugin-eslint'
import useUnoCSS from 'unocss/vite'
import binary from './binary.js'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.exe'],
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
  plugins: [
    useEslint(),
    useUnoCSS(),
    useVue(),
    useElectron([
      {
        entry: 'electron/main.js',
        vite: {},
      },
      {
        entry: 'electron/preload.js',
        onstart(args) {
          args.reload()
        },
        vite: {
          resolve: {
            alias: {
              '@resources': resolve('./electron/resources'),
            },
          },
          plugins: [binary()],
        },
      },
    ]),
    useRenderer(),
  ],
})

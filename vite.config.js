import { resolve } from 'node:path'
import useI18n from '@intlify/unplugin-vue-i18n/vite'
import useVueRouter from 'unplugin-vue-router/vite'
import useVue from '@vitejs/plugin-vue'
import useVueJsx from '@vitejs/plugin-vue-jsx'
import useUnoCSS from 'unocss/vite'
import { defineConfig, mergeConfig } from 'vite'

import useElectron from 'vite-plugin-electron/simple'
import useRenderer from 'vite-plugin-electron-renderer'
import useSvg from 'vite-svg-loader'

import postcssConfig from './postcss.config.js'

import useAutoImports from './src/plugins/auto.js'

const alias = {
  $: resolve('src'),
  $root: resolve(),
  $docs: resolve('docs'),
  $renderer: resolve('src'),
  $electron: resolve('electron'),
  $control: resolve('control'),
  $explorer: resolve('explorer'),
  $copilot: resolve('copilot'),
}

function mergeCommon(config, { command = '' } = {}) {
  return mergeConfig(
    {
      resolve: {
        alias,
      },
      build: {
        rollupOptions: {
          external: [
            '@lydell/node-pty',
            '@lydell/node-pty-darwin-arm64',
            '@lydell/node-pty-darwin-x64',
            '@lydell/node-pty-linux-arm64',
            '@lydell/node-pty-linux-x64',
            '@lydell/node-pty-win32-x64',
          ],
        },
      },
    },
    config,
  )
}

export default function (args) {
  return mergeCommon(
    defineConfig({
      server: {
        port: 1535,
      },
      build: {
        rollupOptions: {
          input: {
            main: resolve('index.html'),
            control: resolve('control/index.html'),
            explorer: resolve('explorer/index.html'),
            copilot: resolve('copilot/index.html'),
          },
        },
      },
      plugins: [
        useUnoCSS(),
        useSvg(),
        useVueRouter({
          exclude: ['src/pages/**/components'],
        }),
        useVue(),
        useVueJsx(),
        useI18n({
          include: [resolve('src/locales/languages/**')],
        }),
        useElectron({
          main: {
            entry: 'electron/main.js',
            vite: mergeCommon({}, args),
          },
          preload: {
            input: 'electron/preload.js',
            vite: mergeCommon({}, args),
          },
        }),
        useRenderer(),
        ...useAutoImports(),
      ],
      css: {
        postcss: postcssConfig,
      },
    }),
  )
}

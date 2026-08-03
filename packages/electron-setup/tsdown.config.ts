import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'main/index.ts',
    'plugins/index.ts',
  ],
  dts: true,
  exports: true,
  publint: false,
  deps: {
    neverBundle: [
      'electron',
      'electron-store',
      '@escrcpy/electron-ipcx',
    ],
  },
})

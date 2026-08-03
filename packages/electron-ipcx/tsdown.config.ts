import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'main/index.ts',
    'renderer/index.ts',
  ],
  dts: true,
  exports: true,
  publint: false,
  deps: {
    neverBundle: [
      'electron',
    ],
  },

})

import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  dts: true,
  exports: true,
  publint: false,
  external: [
    '@autoglm.js/platform-tools-darwin',
    '@autoglm.js/platform-tools-linux',
    '@autoglm.js/platform-tools-windows',
  ],
})
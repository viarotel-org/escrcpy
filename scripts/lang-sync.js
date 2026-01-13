import sync from 'i18next-json-sync'

// @ts-ignore
sync.default({
  excludeFiles: ['**/node_modules/**'],
  files: 'desktop/src/locales/languages/*.json',
  primary: 'zh-CN',
  lineEndings: 'LF',
  space: 2,
})

import sync from 'i18next-json-sync'

sync.default ({
  excludeFiles: ['**/node_modules/**'],
  files: 'src/locales/languages/*.json',
  primary: 'zh-CN',
  lineEndings: 'LF',
  space: 2,
})

import sync from 'i18next-json-sync'

// @ts-ignore
sync.default({
  excludeFiles: ['**/node_modules/**'],
  files: 'desktop/electron/resources/extra/common/locales/*.json',
  primary: 'zh-CN',
  lineEndings: 'LF',
  space: 2,
  finalNewline: true,
})

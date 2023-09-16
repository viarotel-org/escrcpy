/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: ['@electron-toolkit', '@viarotel-org'],
  rules: {
    'no-unused-vars': 'off',
    'eqeqeq': 'off',
    'prefer-promise-reject-errors': 'off',
    'antfu/top-level-function': 'off',
  },
}

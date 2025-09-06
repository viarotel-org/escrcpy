import { createRequire } from 'node:module'
import antfu from '@antfu/eslint-config'

const require = createRequire(import.meta.url)

const autoImport = require('./.eslintrc-auto-import.json')

export default antfu(
  {
    markdown: false,
    ignores: [
      '.github',
      '.vscode',
      'node_modules',
      'dist',
      'dist-electron',
      'dist-release',
      'electron/main.js',
    ],
  },
  {
    languageOptions: {
      globals: {
        definePage: 'readonly',
        ...autoImport.globals,
      },
    },
    rules: {
      'jsdoc/check-param-names': 'off',
      'jsdoc/check-types': 'off',
      'jsdoc/require-returns-description': 'off',

      'antfu/consistent-list-newline': 'off',
      'antfu/top-level-function': 'off',

      'import/default': 'off',
      'import/order': 'off',

      'node/prefer-global/process': 'off',

      'no-console': 'off',
      'curly': 'off',
      'eqeqeq': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
      'no-debugger': 'off',
      'no-restricted-syntax': 'off',
      'no-new': 'off',
      'prefer-promise-reject-errors': 'off',
      'no-unused-expressions': 'off',
      'sort-imports': 'off',

      'vue/html-self-closing': 'off',
      'vue/block-order': 'off',
      'vue/no-unused-refs': 'off',
      'vue/no-mutating-props': 'off',
      'vue/no-constant-condition': 'off',
      'vue/eqeqeq': 'off',
      'vue/custom-event-name-casing': 'off',
      'vue/no-use-v-if-with-v-for': 'off',
      'vue/component-tags-order': 'off',

      'unicorn/consistent-function-scoping': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-dupe-disjunctions': 'off',
      'perfectionist/sort-imports': 'off',
      'no-control-regex': 'off',
    },
  },
)

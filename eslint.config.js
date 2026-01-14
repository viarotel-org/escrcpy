import { createRequire } from 'node:module'
import antfu from '@antfu/eslint-config'

const require = createRequire(import.meta.url)

const desktopAutoImport = require('./desktop/.eslintrc-auto-import.json')

export default antfu(
  {
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },
    ignores: [
      '.github',
      '.vscode',
      'node_modules',
      'dist',
      'dist-electron',
      'dist-release',
    ],
  },
  {
    languageOptions: {
      globals: {
        definePage: 'readonly',
        ...desktopAutoImport.globals,
      },
    },
    rules: {
      'vue/html-self-closing': 'off',
      'vue/block-order': 'off',
      'vue/no-unused-refs': 'off',
      'vue/no-mutating-props': 'off',
      'vue/no-constant-condition': 'off',
      'vue/eqeqeq': 'off',
      'vue/custom-event-name-casing': 'off',
      'vue/no-use-v-if-with-v-for': 'off',
      'vue/component-tags-order': 'off',
      'vue/no-unused-vars': 'off',

      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-dupe-disjunctions': 'off',
      'regexp/optimal-lookaround-quantifier': 'off',
      'regexp/no-super-linear-backtracking': 'off',

      'jsdoc/check-param-names': 'off',
      'jsdoc/check-types': 'off',
      'jsdoc/require-returns-description': 'off',

      'antfu/consistent-list-newline': 'off',
      'antfu/top-level-function': 'off',

      'import/default': 'off',
      'import/order': 'off',

      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',

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
      'unicorn/consistent-function-scoping': 'off',
      'perfectionist/sort-imports': 'off',
      'no-control-regex': 'off',
      'no-cond-assign': 'off',

      'pnpm/yaml-enforce-settings': 'off',

      'ts/no-unsafe-function-type': 'off',
    },
  },
)

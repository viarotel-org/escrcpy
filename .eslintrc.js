module.exports = {
  extends: ['@antfu'],
  rules: {
    'antfu/top-level-function': 'off',
    'no-unused-vars': 'off',
    'eqeqeq': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-new-func': 'off',
    'curly': 'off',
    'no-console': 'off',
    'unused-imports/no-unused-vars': 'off',

    'import/default': 'off',

    'vue/no-mutating-props': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/html-self-closing': 'off',
    'vue/block-order': 'off',
    'vue/no-unused-refs': 'off',

    'n/prefer-global/process': 'off',

    '@typescript-eslint/no-invalid-this': 'off',
  },
}

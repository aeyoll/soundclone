/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.vue'];

module.exports = {
  root: true,
  env: {
    node: true,
  },
  'ignorePatterns': ['src/types/core/index.ts'],
  'plugins': [
    'import',
  ],
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    '@vue/eslint-config-airbnb',
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  'rules': {
    'quotes': ['error', 'single'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        vue: 'always'
      }
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error'
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
        'extensions': extensions
      },
      'node': {
        'extensions': extensions
      }
    },
    'import/extensions': extensions
  },
}

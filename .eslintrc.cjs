/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
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
        vue: 'never'
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
        ]
      },
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx', '.vue']
      }
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.vue']
  },
}

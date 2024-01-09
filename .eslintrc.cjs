module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vitest/recommended',
    'plugin:svelte/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: 'tsconfig.json',
    extraFileExtensions: ['.svelte'],
  },
  rules: {
    'vitest/expect-expect': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
  },
  plugins: ['svelte', 'vitest', '@typescript-eslint'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['./**/*.js'],
    },
  ],
  parser: '@typescript-eslint/parser',
  settings: {
    'svelte3/typescript': require('typescript'),
  },
};

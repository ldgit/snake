module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'plugin:jest/recommended'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {},
  plugins: ['svelte3', 'jest'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
};

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';
import eslintConfigPrettier from 'eslint-config-prettier';
import * as typescriptParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    files: ['**/*.svelte', '*.svelte'],
    languageOptions: {
      parserOptions: {
        svelteConfig,
        /**
         * Need these options so eslint can correctly check typescript syntax in .svelte files.
         *
         * @see https://sveltejs.github.io/eslint-plugin-svelte/user-guide/#parser-configuration
         */
        parser: typescriptParser,
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte'],
      },
    },
  },
  { rules: { '@typescript-eslint/no-unused-vars': 'warn' } },
];

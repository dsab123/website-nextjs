// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript recommended (this is an ARRAY; spread it at top level)
  ...tseslint.configs.recommended,

  // JS files: enable core indent rule (2 spaces) + a couple of autofixes
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      indent: ['error', 2],
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },

  // TS files: use the TS parser; don't use core `indent` (it doesn't understand TS well)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      indent: 'off',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },
];

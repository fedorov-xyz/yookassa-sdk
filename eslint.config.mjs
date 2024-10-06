// @ts-check

import ESLint from '@eslint/js';
import TypeScriptESLint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default TypeScriptESLint.config(
  ESLint.configs.recommended,
  ...TypeScriptESLint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs'],
          defaultProject: './tsconfig.json',
        },
        allowDefaultProject: ['*.mjs'],
      },
    },
  },
  prettierConfig,
  {
    rules: {
      '@typescript-eslint/no-unsafe-call': 'error',
    },
  },
);

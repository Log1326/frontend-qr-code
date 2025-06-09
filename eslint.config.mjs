import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals.js';
import prettierConfig from 'eslint-config-prettier';

import tsEslintParser from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';

import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  {
    ignores: [
      '**/node_modules',
      '**/.next',
      '**/out',
      '**/dist',
      '**/coverage',
    ],
  },

  ...compat.config(nextCoreWebVitals),
  ...compat.config(prettierConfig),

  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true, endOfLine: 'auto' }],
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      'no-relative-import-paths': noRelativeImportPaths,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsEslintParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Пути импорта
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        { allowSameFolder: false, rootDir: 'src', prefix: '@' },
      ],

      // React
      'react-hooks/exhaustive-deps': 'warn',
      'react/function-component-definition': 'off',
      'react/destructuring-assignment': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',

      // Прочее
      'consistent-return': 'off',
      'no-param-reassign': 'off',
      'operator-linebreak': 'off',
      'no-restricted-syntax': [
        'error',
        'ForInStatement',
        'LabeledStatement',
        'WithStatement',
      ],

      // Импорты
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'import/no-cycle': ['error', { maxDepth: 1 }],
      'import/order': 'off',

      // Prettier
      'prettier/prettier': ['error', { singleQuote: true, endOfLine: 'auto' }],

      // Unused (удаление неиспользуемого)
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // TypeScript
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',

      // Сортировка
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
];

export default eslintConfig;

import eslintJs from '@eslint/js'
import tsESLint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'

const tsRecommendedRules = { ...tsESLint.configs.recommended.rules }
delete tsRecommendedRules['object-curly-spacing']

export default [
  eslintJs.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        fail: 'readonly',
      },
    },
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tsESLint,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsRecommendedRules,
      '@typescript-eslint/no-explicit-any': 'warn',
      'object-curly-spacing': 'off',
      '@typescript-eslint/semi': 'off',
      semi: 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'off',
      'prettier/prettier': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
        },
      ],
    },
  },
]

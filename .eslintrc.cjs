/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  ignorePatterns: ['**/*.d.ts', '**/cdk.out/**', '**/node_modules/**'],
  extends: [
    // By extending from a plugin config, we can get recommended rules without having to add them manually.
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
    // Make sure it's always the last config, so it gets the chance to override other configs.
    'eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  settings: {
    react: {
      // Tells eslint-plugin-react to automatically detect the version of React to use.
      version: 'detect',
    },
    // Tells eslint how to resolve imports
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // Add your own rules here to override ones from the extended configs.
    'react/prop-types': 0,
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/no-multi-comp': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
      },
    ],
    'object-shorthand': ['error', 'always'],
    // "@typescript-eslint/no-unused-vars": "error",
    'no-console': ['error'],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: 'Enums are disallowed. Use const = {} as const instead',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'objectLiteralProperty',
        format: ['snake_case', 'camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
    ],
  },
  overrides: [
    {
      files: ['*.tsx'],
      rules: {
        // TypeScript React-specific rules for .tsx files
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
          },
        ],
      },
    },
    {
      files: ['server/**/*.ts', 'services/**/*.ts'],
      parserOptions: { project: ['./tsconfig.json'] },
      rules: {
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/require-await': 'error',
      },
    },
  ],
};

module.exports = {
  extends: ['standard-with-typescript', 'prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  env: {
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'max-params': ['warn', { max: 6 }],
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/return-await': 'off',
    'array-bracket-spacing': ['error', 'never'],
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-extraneous-class': 'warn',
    '@typescript-eslint/no-this-alias': 'warn',
    'no-case-declarations': 'off',
    'no-prototype-builtins': 'warn'
  },
  ignorePatterns: ['website/*', './gulpfile.ts', './tests/**/*.ts', './jest.config.js']
}

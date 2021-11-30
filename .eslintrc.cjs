module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
  globals: {
    fetch: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['jest'],
  env: {
    browser: true,
    es2022: true,
    'jest/globals': true,
  },
  settings: {
    jest: {
      // eslint-disable-next-line import/no-extraneous-dependencies, global-require
      version: require('jest/package.json').version,
    },
  },
  rules: {
    'import/extensions': ['error', 'always', { ignorePackages: true }],
    semi: ['error', 'always'],
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        singleQuote: true,
        endOfLine: 'auto',
      },
    ],
    'no-console': 2,
  },
};

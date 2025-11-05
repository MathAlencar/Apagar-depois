module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
    'class-methods-use-this': 'off',
    'import/first': 'off',
    'max-len': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-use-before-define': 'off',
    'space-before-blocks': 'off',
    'Unexpected token': 'off',
    'max-classes-per-file': 'off',
    'import/extensions': 'off'
  },
};

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-var': 'error',
    eqeqeq: 2,
    'no-console': 2,
    'no-debugger': 2,
    'no-prototype-builtins': 'off',
    'no-useless-escape': 'off',
  },
};

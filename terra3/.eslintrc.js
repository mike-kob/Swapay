module.exports = {
  'env': {
    'browser': true,
    'es2020': true,
    'node': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 11,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
  ],
  'rules': {},
  'overrides': [
    {
      'files': ['*.js'], // Or *.test.js
      'rules': {
        'require-jsdoc': 'off',
        'react/prop-types': 'off',
        'max-len': 'off',
      },
    },
  ],
};

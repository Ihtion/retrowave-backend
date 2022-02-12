module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  "rules": {
    "func-names": "off",
    "no-param-reassign": "off",
    "no-underscore-dangle": "off",
    "camelcase": "off",
    "import/prefer-default-export": "off",
    "import/no-dynamic-require": "off",
    "prettier/prettier": [
      "error"
    ],
    "padding-line-between-statements": [
      "error",
      {"blankLine": "always", "prev": "directive", "next": "*"},
      {"blankLine": "any",    "prev": "directive", "next": "directive"},
      {"blankLine": "always", "prev": "*", "next": ["const", "let", "var", "export"]},
      {"blankLine": "always", "prev": ["const", "let", "var", "export"], "next": "*"},
      {"blankLine": "any",    "prev": ["const", "let", "var", "export"], "next": ["const", "let", "var", "export"]},
      {"blankLine": "always", "prev": "*", "next": ["if", "class", "for", "do", "while", "switch", "try"]},
      {"blankLine": "always", "prev": ["if", "class", "for", "do", "while", "switch", "try"], "next": "*"},
      {"blankLine": "always", "prev": "*", "next": "return"}
    ]
  },
};

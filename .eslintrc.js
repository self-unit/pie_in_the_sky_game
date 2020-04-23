module.exports = {
  "extends": [
    "standard",
    "plugin:prettier/recommended"
  ],
  "plugins": [],
  "globals": {
    "fetch": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "allowImportExportEverywhere": true
  },
  "rules": {
    "semi": [
      "error",
      "always"
    ],
    "prettier/prettier": [
      "error",
      {
        "arrowParens": "always",
        "printWidth": 120,
        "singleQuote": true,
        "trailingComma": "es5",
        "endOfLine":"auto"
      }
    ]
  }
}
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: "@typescript-eslint/parser",
  extends: [
    'eslint:recommended',
    "plugin:@typescript-eslint/recommended",
    'plugin:react-hooks/recommended',
    "plugin:prettier/recommended",
  ],
  plugins: ["react-refresh"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    camelcase: "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-function" : "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "prettier/prettier": [
      "error",
      {
        printWidth: 80,
        semi: false,
        singleQuote: true,
        trailingComma: "es5",
        quoteProps: "preserve"
      }
    ],
    quotes: [
      2,
      "single",
      {
        allowTemplateLiterals: true,
        avoidEscape: true
      }
    ]
  },
  settings: {
    "import/resolver": {
      typescript: {}
    }
  }
}

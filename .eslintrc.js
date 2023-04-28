module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: [
      "./tsconfig.json",
      "./packages/type-graphql/tsconfig.json",
      "./packages/type-graphql/tests/tsconfig.json",
      "./scripts/tsconfig.json",
      "./examples/tsconfig.json",
      "./examples/tsconfig.esm.json",
      "./benchmarks/tsconfig.json",
    ],
    tsconfigRootDir: __dirname,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: [
          "./tsconfig.json",
          "./packages/type-graphql/tsconfig.json",
          "./packages/type-graphql/tests/tsconfig.json",
          "./scripts/tsconfig.json",
          "./examples/tsconfig.json",
          "./examples/tsconfig.esm.json",
          "./benchmarks/tsconfig.json",
        ],
      },
    },
  },
  reportUnusedDisableDirectives: true,
  plugins: ["import", "@typescript-eslint", "eslint-plugin-tsdoc", "jest"],
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "eslint:recommended",
    "plugin:@cspell/recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jest/recommended",
    "prettier",
  ],
  rules: {
    "tsdoc/syntax": "warn",
    "no-restricted-syntax": "off",
    curly: ["error", "all"],
    "nonblock-statement-body-position": ["error", "below"],
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
    "import/order": [
      "error",
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
        },
        groups: ["builtin", "external", "internal", ["sibling", "parent"], "index", "unknown"],
        "newlines-between": "never",
        pathGroups: [
          { pattern: "@/**", group: "internal", position: "before" },
          { pattern: "type-graphql", group: "external" },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
      },
    ],
    "import/no-default-export": "error",
    "import/prefer-default-export": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-inferrable-types": [
      "error",
      { ignoreParameters: true, ignoreProperties: true },
    ],
    // FIXME: Remove
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          Function: false,
          Object: false,
          "{}": false,
        },
        extendDefaults: true,
      },
    ],
    // FIXME: Remove
    "@typescript-eslint/no-explicit-any": "off",
  },
};

import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-plugin-prettier";
import eslintPluginImport from "eslint-plugin-import";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: "latest"
    },
    plugins: {
      "import": eslintPluginImport,
      "@typescript-eslint": ts,
      "react": react,
      "react-hooks": reactHooks,
      "prettier": prettier
    },
    rules: {
      "no-undef": "off",
      "no-console": "warn",
      "no-unused-vars": "warn",
      "no-unsafe-optional-chaining": "off",
      "import/no-empty-named-blocks": "warn",

      "prettier/prettier": "warn",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": ["error", { "extensions": [".tsx"] }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["off", { "argsIgnorePattern": "^_" }],

      "sort-imports": [
        "warn",
        {
          "ignoreCase": false,
          "ignoreDeclarationSort": true,
          "ignoreMemberSort": false,
          "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
        }
      ],
      "import/order": [
        "warn",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          "pathGroups": [
            {
              "pattern": "@config/**",
              "group": "internal",
              "position": "after"
            },
            {
              "pattern": "@context/**",
              "group": "internal",
              "position": "after"
            },
            {
              "pattern": "@components/**",
              "group": "internal",
              "position": "after"
            },
            {
              "pattern": "@services/**",
              "group": "internal",
              "position": "after"
            },
            {
              "pattern": "@utils/**",
              "group": "internal",
              "position": "after"
            }
          ],
          "pathGroupsExcludedImportTypes": ["builtin"]
        }
      ]

    },
    settings: { react: { version: "detect" } }
  }
];

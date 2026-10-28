// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
  {
    ignores: [
      "src/assets/**",
      "dist/**",
      "coverage/**"
    ]
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      // The v19/v22 migrations kept this as an NgModule app with the previous
      // change-detection strategy. These rules would rewrite that structure.
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
      "@angular-eslint/prefer-standalone": "off",
      "@angular-eslint/prefer-inject": "off",
      "@angular-eslint/no-empty-lifecycle-method": "off",
      // The game code is intentionally loosely typed. Tightening it is out of
      // scope for the framework upgrade.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/ban-tslint-comment": "off",
      "no-useless-assignment": "off",
      "no-var": "off",
    },
  },
  {
    files: ["src/app/phaser/**/*.ts"],
    rules: {
      // Keeps the selector the old phaser-component-library template used.
      "@angular-eslint/component-selector": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
    ],
    rules: {
      // Existing dashboard/tile markup uses labels as text, not form controls.
      "@angular-eslint/template/label-has-associated-control": "off",
    },
  }
]);

import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["**/dist", "examples", "packages/e2e", "coverage"],
  },
  js.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["*.ts"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      // eslint-disable-next-line no-undef
      tsconfigRootDir: process.cwd(),
      project: [
        "./tsconfig.json",
        "./packages/*/tsconfig.json",
        "./examples/*/tsconfig.json",
      ],
    },
    rules: {
      ...typescriptPlugin.configs["recommended-requiring-type-checking"].rules,
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
    },
  },
  eslintConfigPrettier,
];

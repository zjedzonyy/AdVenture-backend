import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.jest,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...(js.configs.recommended.rules ?? {}),
      // This turns off ESLint rules that conflict with Prettier
      ...prettierConfig.rules,
      // This tells ESLint to run Prettier as a rule
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
    },
  },
]);

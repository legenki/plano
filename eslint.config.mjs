import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        _p5: "readonly",
        p5: "readonly",
        console: "readonly",
        document: "readonly",
        window: "readonly",
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "off"
    }
  }
];

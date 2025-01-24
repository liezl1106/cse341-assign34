import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Specify file patterns
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      // Add support for Node.js globals and CommonJS
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest", // Use the latest ECMAScript version
    },
  },
  // Add configurations for JavaScript and React
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Custom rules (optional)
  {
    rules: {
      "no-undef": "off", // Disable undefined variable warnings
      "no-unused-vars": ["warn", { args: "none" }], // Adjust unused variables rule
    },
  },
];
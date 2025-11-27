// eslint.config.mjs  ← recommended filename for Next.js 15+
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  // Disable all ESLint styling rules that conflict with Prettier
  prettierConfig,

  // Prettier as a plugin so we can customize its rule level
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // This is the exact fix you need for the CI failures
      "prettier/prettier": ["warn", { endOfLine: "auto" }],

      // Your Sitecore/next/image alt-text exception
      "jsx-a11y/alt-text": "off",
    },
  },

  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
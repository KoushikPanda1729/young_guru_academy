import { nextJsConfig } from "@t2p-admin/eslint-config/next-js";
import tanstackQuery from "@tanstack/eslint-plugin-query";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    plugins: {
      "@tanstack/query": tanstackQuery,
    },
    rules: {
      ...tanstackQuery.configs.recommended.rules,
      'react/prop-types': 'off',
    },
  },
];

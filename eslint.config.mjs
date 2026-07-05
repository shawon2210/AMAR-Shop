import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@next/next/no-img-element': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project-specific ignores:
    "backend/**",
    "scripts/**",
    "k6-scripts/**",
    "grafana-dashboards/**",
    "k8s/**",
    "src/__tests__/**",
    "docker-compose*.yml",
    "Dockerfile",
    "event-driven-architecture/**",
    "public/sw.js",
  ]),
]);

export default eslintConfig;

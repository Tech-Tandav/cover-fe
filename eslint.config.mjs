import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Auto-generated shadcn/ui primitives — don't lint them.
    "src/components/ui/**",
  ]),
  {
    // Project-wide rule overrides.
    rules: {
      // React 19 strict rules — overly aggressive for our data-fetching patterns.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      // Allow `any` in pre-existing template files; we'll narrow as we go.
      "@typescript-eslint/no-explicit-any": "warn",
      // Unused vars become warnings, not errors.
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow apostrophes in JSX text.
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;

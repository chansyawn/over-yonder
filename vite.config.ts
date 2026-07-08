import { defineConfig } from "vite-plus";

const generatedPatterns = [
  "dist/**",
  "apps/*/dist/**",
  "packages/*/dist/**",
  "apps/desktop/src-tauri/gen/**",
  "apps/desktop/src-tauri/target/**",
];

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: generatedPatterns,
  },
  lint: {
    ignorePatterns: generatedPatterns,
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});

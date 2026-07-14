import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [svgr()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  pack: {
    dts: {
      tsgo: true,
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});

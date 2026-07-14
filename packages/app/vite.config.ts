import { defineConfig } from "vite-plus";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [svgr()],
  pack: {
    plugins: [svgr()],
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

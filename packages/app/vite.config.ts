import { defineConfig } from "vite-plus";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: "../../project.inlang",
      outdir: "./src/paraglide",
      strategy: ["baseLocale"],
      emitTsDeclarations: true,
    }),
    svgr(),
  ],
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
});

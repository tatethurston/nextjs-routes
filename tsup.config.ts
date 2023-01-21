import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: ["esm", "cjs"],
  bundle: true,
  skipNodeModulesBundle: true,
  minify: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
});

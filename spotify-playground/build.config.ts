import { BuildConfig } from "bun";

const config: BuildConfig = {
  entrypoints: ["./src/client.tsx"],
  outdir: "./public/assets",
  target: "browser",
  minify: true,
  sourcemap: "external",
};

export default config; 
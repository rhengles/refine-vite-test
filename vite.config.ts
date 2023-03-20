import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve as pathResolve } from "node:path";
import { fileURLToPath } from "node:url";

const dirname = fileURLToPath(new URL("./", import.meta.url)).replace(
  /\/+$/,
  ""
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~/": `${pathResolve(dirname, "src")}/`
    }
  },
  build: {
    minify: false
  }
});

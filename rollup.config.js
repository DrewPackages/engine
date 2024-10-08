import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "out",
      format: "esm",
      entryFileNames: "[name].mjs",
    },
    {
      dir: "out",
      format: "cjs",
      entryFileNames: "[name].cjs",
    },
  ],
  treeshake: "recommended",
  external: ["reflect-metadata", "typedi", "jsonschema", "zod"],
  plugins: [
    typescript({
      declaration: true,
      outDir: "out",
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
    }),
    terser({
      format: {
        comments: "some",
        beautify: true,
        ecma: "2022",
      },
      compress: false,
      mangle: false,
      module: true,
    }),
  ],
};

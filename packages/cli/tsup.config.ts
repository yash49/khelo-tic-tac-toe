import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: 'dist',
  dts: false, // or true if you want type declarations
  external: ['execa', 'node:*', 'dgram'], // any node_modules packages
  //   banner: {
  //     js: '#!/usr/bin/env node',
  //   },
});

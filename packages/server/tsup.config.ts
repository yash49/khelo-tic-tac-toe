// todo: sync this with cli's tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  target: 'node18',
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: 'dist',
  dts: false, // or true if you want type declarations
  external: ['node:*'], // any node_modules packages
  //   banner: {
  //     js: '#!/usr/bin/env node',
  //   },
});

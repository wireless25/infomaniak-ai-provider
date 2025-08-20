import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
  {
    entry: ['src/client/index.ts'],
    outDir: 'dist/client',
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
])

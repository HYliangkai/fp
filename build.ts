/** Build deno package to npm package */
import { build, emptyDir } from 'https://deno.land/x/dnt@0.38.0/mod.ts'

await emptyDir('./npmBuild')

await build({
  entryPoints: ['./mod.ts'],
  outDir: './npmBuild',
  shims: {
    deno: true,
  },
  package: {
    name: 'FPTools',
    version: '0.1.0',
  },
})

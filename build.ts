/** Build deno package to npm package */
import { build, emptyDir } from 'https://deno.land/x/dnt@0.38.0/mod.ts'

await emptyDir('./npmBuild')

await build({
  entryPoints: ['./mod.ts'],
  outDir: './npmBuild',
  shims: {
    deno: true,
  },
  packageManager: 'pnpm',
  package: {
    author: 'https://github.com/HYliangkai',
    name: '@chzky/fp-tools',
    version: '0.2.2',
    main: './esm/mod.js',
    access: 'public',
  },
})

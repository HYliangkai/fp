/** Build deno package to npm package */
import {build, emptyDir} from 'https://deno.land/x/dnt@0.38.0/mod.ts'
import {result} from '../../../mod.ts'
await emptyDir('./dist')
result(async () => {
  const jsonc = JSON.parse(new TextDecoder('utf-8').decode(await Deno.readFile('./deno.jsonc')))
  const version = jsonc.version
  const version_array = version.split('.')
  const prefix = version_array.slice(0, -1)
  prefix.push(String(Number(version_array.at(-1)) + 1))
  const res = prefix.join('.')
  jsonc.version = res
  await Deno.writeTextFile('./deno.jsonc', JSON.stringify(jsonc))
  result(async () => {
    await build({
      entryPoints: ['./mod.ts'],
      outDir: './dist',
      shims: {
        deno: true,
      },
      packageManager: 'pnpm',
      package: {
        author: 'https://github.com/HYliangkai',
        name: '@chzky/fp-tools',
        version: res,
        main: './esm/mod.js',
        access: 'public',
      },
    })
  }).unwarp()
}).unwarp()

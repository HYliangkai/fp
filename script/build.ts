/** Build deno package to npm package */

import {build, emptyDir} from 'https://deno.land/x/dnt@0.38.1/mod.ts'
import {Err, Ok, option, result} from '../mod.ts'
import {join} from 'https://deno.land/std@0.204.0/path/mod.ts'
type Path = {__dirname: Option<string>; __filename: Option<string>}
const path = (): Result<Path, string> => {
  const url = new URL(import.meta.url)
  if (url.protocol === 'file:') {
    return Ok({
      __dirname: option(url.pathname.split('/').slice(0, -1).join('/')),
      __filename: option(url.pathname.split('/').at(-1)),
    })
  } else {
    return Err('No Local documents')
  }
}
const {__dirname} = path().unwarp()
const dirname = __dirname.unwarp()
const relative_to_absolute = (relative: string) => join(dirname, relative)

await emptyDir(relative_to_absolute('../dist'))
result(async () => {
  const jsonc = JSON.parse(
    new TextDecoder('utf-8').decode(await Deno.readFile(relative_to_absolute('../deno.jsonc')))
  )
  const version = jsonc.version
  const version_array = version.split('.')
  const prefix = version_array.slice(0, -1)
  prefix.push(String(Number(version_array.at(-1)) + 1))
  const res = prefix.join('.')
  jsonc.version = res

  await Deno.writeTextFile(relative_to_absolute('../deno.jsonc'), JSON.stringify(jsonc))
  result(async () => {
    await build({
      test: false,
      entryPoints: [relative_to_absolute('../mod.ts')],
      outDir: relative_to_absolute('../dist'),
      shims: {
        deno: true,
      },
      packageManager: 'npm',
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

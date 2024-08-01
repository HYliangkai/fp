/** Build deno package to npm package */
import { Err, Ok, type Option, type Result, option, result } from '@chzky/fp'
import { build, emptyDir } from 'jsr:@deno/dnt'
import { join } from '@std/path/mod.ts'

type Path = { __dirname: Option<string>; __filename: Option<string> }
const NAME = '@chzky/fp'
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
const { __dirname } = path().unwarp()
const dirname = __dirname.unwarp()
const relative_to_absolute = (relative: string) => join(dirname, relative)

const OUTPUT_DIR = '../deno.json'

await emptyDir(relative_to_absolute('../dist'))
result(async () => {
  result(async () => {
    await build({
      test: false,
      entryPoints: [relative_to_absolute('../mod.ts')],
      outDir: relative_to_absolute('../dist'),
      shims: {
        deno: true,
      },
      packageManager: 'pnpm',
      package: {
        author: 'https://github.com/HYliangkai',
        name: NAME,
        version: JSON.parse(
          new TextDecoder('utf-8').decode(await Deno.readFile(relative_to_absolute(OUTPUT_DIR)))
        ).version,
        main: './esm/mod.js',
        access: 'public',
      },
      compilerOptions: {
        target: 'ES2016',
      },
    })
  }).unwarp()
}).unwarp()

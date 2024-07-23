import { join } from 'jsr:@std/path@^0.218.2/join'

const JSON_PATH = join(import.meta.dirname!, '../deno.json')

const pack = JSON.parse(await Deno.readTextFile(JSON_PATH))
pack.version = (pack.version as string)
  .split('.')
  .map(Number)
  .map((i, idx) => i + (idx === 2 ? 1 : 0))
  .join('.')
await Deno.writeTextFile(JSON_PATH, JSON.stringify(pack, null, 2), {
  create: true,
})

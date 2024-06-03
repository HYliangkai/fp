import {assertEquals} from '@std/assert/mod.ts'
import {join} from 'jsr:@std/path@^0.218.2/join'
import {flow, pipe} from 'lib'

Deno.test('同步pipe', () => {
  const origin = 0
  const first = (x: number) => x + 1
  const second = (x: number) => x * 2
  const res = pipe(origin, first, second)
  assertEquals(res, 2)
})

Deno.test('异步pipe', async () => {
  const origin = 0
  const first = (x: number) => x + 1
  const second = (x: number): Promise<number> => {
    return new Promise(res => {
      setTimeout(() => {
        res(x * 2), 1000
      })
    })
  }
  const third = async (x: number) => {
    return await new Promise(res => {
      setTimeout(() => {
        res(x + 1), 1000
      })
    })
  }

  const res = await pipe(origin, first, second, third)
  assertEquals(res, 3)
})

// Deno.test('嵌套pipe', async () => {
//   // const relative_to_absolute = (relative: string) => join(import.meta.dirname!, relative)
//   // const flo = flow(relative_to_absolute, Deno.readTextFile)
//   // await flow(flo, res => JSON.parse(res))('../../deno.json')
// })

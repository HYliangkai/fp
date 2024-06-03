import {assertEquals} from '@std/assert/mod.ts'
import {pipe} from 'lib'

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

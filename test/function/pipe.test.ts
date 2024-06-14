import { assertEquals, assertNotEquals } from '@std/assert/mod.ts'
import { flow, lzpipe, pipe } from 'lib'

Deno.test('auto-pipe', () => {
  const origin = 0
  const first = (x: number) => x + 1
  const second = (x: number) => x * 2
  const res = pipe(origin, first, second)
  assertEquals(res, 2)
})

Deno.test('auto-pipe', async () => {
  const origin = 0
  const first = (x: number) => x + 1
  const second = (x: number): Promise<number> => {
    return new Promise((res) => {
      setTimeout(() => {
        res(x * 2), 1000
      })
    })
  }
  const third = async (x: number) => {
    return await new Promise((res) => {
      setTimeout(() => {
        res(x + 1), 1000
      })
    })
  }

  const res = await pipe(origin, first, second, third)
  assertEquals(res, 3)
})

Deno.test('nesting-pipe', async () => {
  const async_fn = async (val: number) =>
    await new Promise<number>((res) => {
      setTimeout(() => {
        res(val * 2)
      }, 100)
    })

  const sync_fn = (val: number) => val + 1

  const res = pipe(0, sync_fn, async_fn)
  assertNotEquals(res as any, (0 + 1) * 2)
  assertEquals(await res, (0 + 1) * 2)

  const flo = flow(async_fn, sync_fn)
  const res2 = pipe(2, flo, flow(async_fn))
  assertEquals(await res2, (2 * 2 + 1) * 2)

  const res3 = pipe(
    2,
    (v) => Promise.resolve(v + 1),
    async (v) => v * 3
  )
  assertEquals(await res3, (2 + 1) * 3)

  const lzp = lzpipe(2, flo)
  const run = (b: number) => {
    return Promise.resolve<number>(b + 2)
  }
  const res4 = pipe.sync(await lzp(), run)
  assertEquals(await res4, 2 * 2 + 1 + 2)
})

Deno.test('pipe.sync', () => {
  const origin = 0
  const first = (x: number) => x + 1
  const second = (x: number) => x * 2
  const third = (x: number) => Promise.resolve(x + 11)
  const res = pipe.sync(origin, first, second)
  assertEquals(res, 2)

  pipe
    .sync(origin, third, async (r) => {
      return (await r) + 1
    })
    .then((res) => {
      assertEquals(res, 12)
    })
})

Deno.test('pipe.async', async () => {
  const origin = 0
  const first = (x: number) => x + 1
  const second = (x: number) => x * 2
  const third = (x: number) => Promise.resolve(x + 11)

  const res = await pipe.async(origin, first, second)
  assertEquals(res, 2)

  const res2 = await pipe.async(origin, third, first)
  assertEquals(res2, 12)
})

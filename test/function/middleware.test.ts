import { assertEquals } from '@std/assert/mod.ts'
import { middleware } from '@chzky/fp'

Deno.test('middleware', async () => {
  const val = (data: number) => data + 1
  const res = middleware(val)(1)
  assertEquals(res, 2)
  const val2 = (data: number) => undefined
  const res2 = middleware(val2)(1)
  assertEquals(res2, 1)
  const val3 = (data: number) => data + 1 //@ts-ignore
  const res3 = middleware(val3)(undefined)
  assertEquals(res3, NaN)
  const val4 = (data: number) => data + 1 //@ts-ignore
  const res4 = middleware(val4)(null)
  assertEquals(res4, 1)
  const val5 = (data: number) => data + 1
  const res5 = middleware(val5)(0)
  assertEquals(res5, 1)
  const val6 = (data: number) => data + 1
  const res6 = middleware(val6)(-1)
  assertEquals(res6, 0)
  const val7 = (data: number) => data + 1
  const res7 = middleware(val7)(NaN)
  assertEquals(res7, NaN)
  const val8 = (data: number) => data + 1
  const res8 = middleware(val8)(Infinity)
  assertEquals(res8, Infinity)
  const val9 = (data: number) => data + 1
  const res9 = middleware(val9)(-Infinity)
  assertEquals(res9, -Infinity)
  const val10 = (data: number) => data + 1
  const res10 = middleware(val10)(1.1)
  assertEquals(res10, 2.1)
})

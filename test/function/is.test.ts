import { assertEquals } from '@std/assert/mod.ts'
import { is_async_func, is_number, zod } from '@chzky/fp'
Deno.test('is_async_func', () => {
  const sync = (x: number) => x + 1
  const asyncfn = async (x: number) =>
    new Promise((res) => {
      setTimeout(() => {
        res(x + 1)
      }, 1000)
    })
  // const
  assertEquals(is_async_func(asyncfn), true)
  assertEquals(is_async_func(sync), false)
})

Deno.test('is_number', () => {
  assertEquals(is_number(1), true)
  assertEquals(is_number('1'), true)
  assertEquals(is_number('1.1'), true)
  assertEquals(is_number('114514'), true)
  assertEquals(is_number(Infinity), true)
  assertEquals(is_number(-Infinity), true)
  assertEquals(is_number('a'), false)
  assertEquals(is_number(null), false)
  assertEquals(is_number(undefined), false)
  assertEquals(is_number(NaN), false)
  assertEquals(is_number({}), false)
  assertEquals(is_number([]), false)
  assertEquals(
    is_number(() => {}),
    false
  )
  assertEquals(is_number(Symbol()), false)
  assertEquals(is_number(true), false)
  assertEquals(is_number(false), false)
})

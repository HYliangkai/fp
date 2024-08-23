import { assertEquals } from '@std/assert/mod.ts'
import { curry } from '@chzky/fp'

Deno.test('curry', () => {
  const first = (a: number, a1: number) => (b: number) => (a + a1) / b
  const cr_f = curry(first, 2)(1)(3)
  assertEquals(cr_f(2), 2)
  const add = (a: number) => (b: number) => a / b
  const add1 = curry(add)(1)
  assertEquals(add1(2), 0.5)
})

Deno.test('curryse', () => {
  const func = (a: number, b: number, c: number) => [a, b, c]
  const cfn = curry.reverse(func, 3)
  const res = cfn(3)(2)(1)

  assertEquals(res, [1, 2, 3])

  const res1 = cfn(2)(2)(1)
  assertEquals(res1, [1, 2, 2])
})

import {assertEquals} from '@std/assert/mod.ts'
import {curry} from 'lib'

Deno.test('curry', () => {
  const first = (a: number) => a + 1
  const cr_f = curry(first)
  assertEquals(cr_f(1), 2)
})

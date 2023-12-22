import {assertNotEquals, assert} from '@std/assert/mod.ts'
import {Peekable} from 'lib'

Deno.test('Peekable', () => {
  const arr: Iterable<number> = [1, 2, 33, 4, 5]
  const peek = new Peekable(arr)

  assert(peek.next().unwarp() === 1)

  assert(peek.peeked.unwarp() === 2)

  assert(peek.peeked.unwarp() == peek.next().unwarp())
  assert(peek.next().unwarp() !== peek.peeked.unwarp())
})

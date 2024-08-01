import { Peekable } from '@chzky/fp'
import { assert } from '../mod.ts'

Deno.test('Peekable', () => {
  const arr: Iterable<number> = [1, 2, 33, 4, 5]
  const peek = new Peekable(arr)

  assert(peek.next().unwarp() === 1)

  assert(peek.peeked.unwarp() === 2)

  assert(peek.peeked.unwarp() == peek.next().unwarp())
  assert(peek.next().unwarp() !== peek.peeked.unwarp())
})

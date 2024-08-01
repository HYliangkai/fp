import { Peekable } from '@chzky/fp'
import { assert } from '../mod.ts'

Deno.test('Peekable', () => {
  const arr: Iterable<number> = [1, 2, 33, 4, 5]
  const peek = new Peekable(arr)

  assert(peek.next().unwrap() === 1)

  assert(peek.peeked.unwrap() === 2)

  assert(peek.peeked.unwrap() == peek.next().unwrap())
  assert(peek.next().unwrap() !== peek.peeked.unwrap())
})

import { ReadOnlyError, Tuple } from '@chzky/fp'
import { assert_throw, assert } from '@chzky/cest'

Deno.test('tuple-basic', () => {
  const tup = Tuple([1, false, 'xxm'])

  assert_throw(() => {
    //@ts-ignore : cannot change
    tup.safe()[1] = 12
  }, ReadOnlyError)

  assert(tup.eq(Tuple.of(1, false, 'xxm')))
})

Deno.test('tuple-no-pass', () => {
  assert_throw(() => {
    //@ts-ignore : cannot use other type
    Tuple.of(Symbol(11), 'd', () => {})
  }, TypeError)

  assert_throw(() => {
    //@ts-ignore : cannot use empty array
    Tuple([])
  }, TypeError)
})

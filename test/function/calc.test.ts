import { assert, assertEquals } from '@std/assert/mod.ts'
import { Err, NaNError, calc, middleware } from '@chzky/fp'

Deno.test('calc-test', () => {
  const r1 = calc('1+1').unwrap()
  assertEquals(r1, '2')

  //normal type
  const r2 = calc('1+1000', {}, { fmt: [','] }).unwrap()
  assertEquals(r2, '1,001')

  //curry type
  const r3 = calc({ a: '1.123', b: '2.23' }, { unit: true })('a+b').unwrap()
  assertEquals(r3, '3.353')

  calc({ a: '1.2.3' })('a+2').match_err((err) => {
    assert(err instanceof NaNError)
  })
})

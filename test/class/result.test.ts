import { AnyError, Err, Ok } from 'lib'
import { assertEquals, assertThrows } from '../mod.ts'

Deno.test('map_err', () => {
  const err2 = Err(AnyError.new('Debug', 'test'))

  const res = err2
    .map_err(({ error, debug }) => {
      error((val) => Err(val))
      debug(() => {
        return Ok('test')
      })
    })
    .unwarp()
  assertEquals(res, 'test')

  const err3 = Err(AnyError.new('Error', 'test'))
  const res1 = err3.map_err(({ error, debug }) => {
    error((val) => Err(val))
    debug(() => {
      return Ok('test')
    })
  })
  assertThrows(() => {
    res1.match_err((err: AnyError) => {
      if (err instanceof AnyError) throw err
    })
  })
})

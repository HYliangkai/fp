import {assertThrows, assertEquals} from 'https://deno.land/std@0.206.0/assert/mod.ts'
import {AnyError, Err, Ok} from 'lib'

Deno.test('map_err', () => {
  const err1 = Err('Nihao')
  //lsp tips never,can't use map_err
  // err1.map_err(() => {})

  const err2 = Err(AnyError.new('test', {type: 'Debug'}))

  const res = err2
    .map_err(({error, debug}) => {
      error(val => Err(val))
      debug(() => {
        return Ok('test')
      })
    })
    .unwarp()
  assertEquals(res, 'test')

  /**  */

  const err3 = Err(AnyError.new('test', {type: 'Error'}))
  const res1 = err3.map_err(({error, debug}) => {
    error(val => Err(val))
    debug(() => {
      return Ok('test')
    })
  })
  assertThrows(() => {
    res1.match_err(err => {
      if (err instanceof AnyError) throw err
    })
  })
})

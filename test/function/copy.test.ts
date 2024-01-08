import {shallow_copy} from 'lib'
import {assert, assertEquals, assertFalse, assertNotEquals} from '../mod.ts'

Deno.test('shallow-copy', () => {
  assert(shallow_copy(1) === 1)
  assert(shallow_copy(null) === null)
  assert(shallow_copy(undefined) === undefined)
  const A = {name: 'jiojio'}
  assertFalse(shallow_copy(A) === A, 'Not equald in obj')
  const B = {name: 'jiojio', info: {name: 'dio'}}
  assert(shallow_copy(B).name === B.name)
  assert(shallow_copy(B).info === B.info)
})

import {filter_option, None, Some, unwarp_iter_options, unwarp_option} from 'lib'
import {assert, assertEquals} from '../mod.ts'

Deno.test('filter-option', () => {
  const V = [Some(1), None, Some(2), None]
  const res = V.filter(filter_option)
  assert(res.every(i => i.is_some))
})

Deno.test('unwarp-option', () => {
  const V = [Some(1), None, Some(2), None]
  const res = V.filter(filter_option).map(unwarp_option)
  assertEquals(res, [1, 2])
})

Deno.test('unwarp-iter-options', () => {
  const V = [Some(1), None, Some(2), None]
  const res = unwarp_iter_options(V)
  assertEquals(res, [1, 2])
})

import {assert} from '@std/assert/mod.ts'
import {Default, dayjs, register_expand} from 'lib'
register_expand() /** must be global register */

Deno.test('arrayDefault', () => {
  const adef = Array.default()
  assert(Array.isArray(adef) && adef.length === 0)
})

Deno.test('position', () => {
  const data = ['jiojio', 1, 1, 12123, 'dio']
  const rindex0 = data.position(item => item == 'dio').unwrap_or(0)
  assert(rindex0 === 4)
  const rindex1 = data.rposition(item => item == 1).unwrap_or(0)
  assert(rindex1 === 2)
})

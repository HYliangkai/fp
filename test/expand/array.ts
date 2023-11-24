import {assert} from '@std/assert/mod.ts'
import {Default, dayjs, register_expand} from 'lib'
register_expand() /** must be global register */

Deno.test('arrayDefault', () => {
  const adef = Array.default()
  assert(Array.isArray(adef) && adef.length === 0)
})

const run = (val: Default) => {
  console.log(val.default())
}

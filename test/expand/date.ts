import {assertEquals} from '@std/assert/mod.ts'
import {dayjs, register_expand} from 'lib'
register_expand() /** must be global register */
Deno.test('testdate-func', () => {
  const now = Date.now()
  const format = Date.format(now, 'YYYY-MM-DD HH:mm:ss').unwarp()
  assertEquals(format, dayjs(now).format('YYYY-MM-DD HH:mm:ss'))
  assertEquals(Date.stamp(now).unwarp(), now)
})

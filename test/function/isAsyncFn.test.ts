import {assertEquals} from '@std/assert/mod.ts'
import {is_async_func} from 'lib'
Deno.test('is_async_func', () => {
  const sync = (x: number) => x + 1
  const asyncfn = async (x: number) =>
    new Promise(res => {
      setTimeout(() => {
        res(x + 1)
      }, 1000)
    })
  // const
  assertEquals(is_async_func(asyncfn), true)
  assertEquals(is_async_func(sync), false)
})

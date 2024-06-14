import { assertEquals } from '@std/assert/mod.ts'
import { flow } from 'lib'

//完成flow函数的单元测试
Deno.test('flow', async () => {
  const origin = 0
  const first = (x: number) => x + 1
  const second = (x: number) => x * 2
  const third = (x: number) => Promise.resolve(x + 11)

  const res = await flow(first, second)(origin)
  assertEquals(res, 2)

  // const res2 = await flow(origin, third, first)
  // assertEquals(res2, 12)
})

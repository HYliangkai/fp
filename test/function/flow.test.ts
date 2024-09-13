import { assertEquals, assert } from '@std/assert/mod.ts'
import { flow, Mainstream, Reflux } from '@chzky/fp'

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

Deno.test('flow-shunt', () => {
  const run = flow.sync(
    () => Reflux(123),
    () => Mainstream('xxn'),
    () => Mainstream('xxn'),
    () => Reflux(false),
    () => Mainstream('xxn'),
    () => Mainstream('xxn'),
    () => Mainstream('xxn'),
    () => Mainstream('xxn')
  )

  const re = run(void 0)
  assert(re === 123)
})

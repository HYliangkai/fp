import { Vec } from '@chzky/fp'
import { assert_sequence } from '@chzky/cest'
import { assert } from '@std/assert/mod.ts'

Deno.test('loop-len', () => {
  const gen = (function* () {
    let idx = 0
    while (true) {
      yield idx++
    }
  })()
  const res = Vec(gen)
    .map((i) => `number-is-${i}`)
    .take(100)
    .collect()

  assert(res.length === 100)
})

Deno.test('Vec-stream', async () => {
  const seq = assert_sequence()
  await Vec([1, 2, 3, 4, 5]).stream((i, next) => {
    setTimeout(() => {
      seq(i)
      next()
    }, 500)
  })
})

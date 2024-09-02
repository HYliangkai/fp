import { Vec } from '@chzky/fp'
import { assert_sequence } from '@chzky/cest'
import { assert, assertEquals } from '@std/assert/mod.ts'

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
  const vec = Vec([1, 2, 3, 4, 5])
  await vec.clone().stream((i, next) => {
    setTimeout(() => {
      seq(i)
      next()
    }, 50)
  })

  let idx = 0
  await vec.clone().stream((i, next, cancel) => {
    setTimeout(() => {
      if (idx >= 2) cancel()
      else {
        idx++
        next()
      }
    }, 50)
  })
  assert(idx === 2)
})

Deno.test('Vec-clone', () => {
  const vec1 = Vec([1, 2, 4, 5, 6, 7, 8]).filter((i) => i % 2 === 0)

  const vec2 = vec1.clone().every((i) => i % 2 === 0)
  assert(vec2)
  assertEquals(vec1.collect(), [2, 4, 6, 8])
})

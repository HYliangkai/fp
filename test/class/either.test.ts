// FILEPATH: /Users/chzky/Code/Deno/FPSystem/test/TypeClass/Either.test.ts

import { Left, Right } from '@chzky/fp'
import { assertEquals } from '@std/assert/mod.ts'

Deno.test('either interface', () => {
  const leftValue = 'left'
  const rightValue = 'right'
  const eitherLeft = Left(leftValue)
  const eitherRight = Right(rightValue)

  // Test is_left and is_right
  assertEquals(eitherLeft.is_left, true)
  assertEquals(eitherLeft.is_right, false)
  assertEquals(eitherRight.is_left, false)
  assertEquals(eitherRight.is_right, true)

  // Test left_do and right_do
  let result = ''
  eitherLeft.left_do((val) => (result = val))
  assertEquals(result, leftValue)
  eitherRight.right_do((val) => (result = val))
  assertEquals(result, rightValue)

  // Test match
  eitherLeft.match(
    (val) => assertEquals(val, leftValue),
    (val) => assertEquals(val, rightValue)
  )
  eitherRight.match(
    (val) => assertEquals(val, leftValue),
    (val) => assertEquals(val, rightValue)
  )

  // Test map
  const mappedLeft = eitherLeft.map(
    (val) => val + ' mapped',
    (val) => val
  )
  const mappedRight = eitherRight.map(
    (val) => val,
    (val) => val + ' mapped'
  )
  assertEquals(mappedLeft.merge(), leftValue + ' mapped')
  assertEquals(mappedRight.merge(), rightValue + ' mapped')

  // Test unwarp_left_or and unwarp_right_or
  assertEquals(eitherLeft.unwarp_left_or('default'), leftValue)
  assertEquals(eitherLeft.unwarp_right_or('default'), 'default')
  assertEquals(eitherRight.unwarp_left_or('default'), 'default')
  assertEquals(eitherRight.unwarp_right_or('default'), rightValue)

  // Test to_result
  assertEquals(eitherLeft.to_result().is_ok, true)
  assertEquals(eitherRight.to_result().is_ok, false)

  // Test exchange
  assertEquals(eitherLeft.exchange().is_right, true)
  assertEquals(eitherRight.exchange().is_left, true)

  // Test merge
  assertEquals(eitherLeft.merge(), leftValue)
  assertEquals(eitherRight.merge(), rightValue)

  // Test tap
  eitherLeft.tap((val) => assertEquals(val, leftValue))
  eitherRight.tap((val) => assertEquals(val, rightValue))
})

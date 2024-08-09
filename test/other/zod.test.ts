/** 利用zod的类型校验达到显著的运行时安全效果 */

import { Err, Left, Ok, Right, Some, zod } from '@chzky/fp'

import { assert, assertFalse } from '@std/assert/mod.ts'

Deno.test('test-option-and-zod', () => {
  //先定义shema
  const schema = zod.option(zod.string()) // Option<string>

  const A = 12 // no string and no option
  assertFalse(schema.safeParse(A).success)

  const B = '12' // string and no option
  assertFalse(schema.safeParse(B).success)

  const C = { _tag: 'some', value: '12' } // no string and like option
  assertFalse(schema.safeParse(C).success)

  const D = Some(12) // option and no string
  assertFalse(schema.safeParse(D).success)

  const E = Some('12') // string and  option
  assert(schema.safeParse(E).success) // pass test
})

Deno.test('test-result-and-zod', () => {
  //先定义shema
  const schema = zod.result(zod.string(), zod.number()) // Result<string,number>

  const A = 12 // no string and no result
  assertFalse(schema.safeParse(A).success)

  const B = '12' // string and no result
  assertFalse(schema.safeParse(B).success)

  const C = { _tag: 'Ok', value: '12' } // no string and like result
  assertFalse(schema.safeParse(C).success)

  const D = Some(12) // result and no string
  assertFalse(schema.safeParse(D).success)

  const E = Some('12') // string and  result
  assertFalse(schema.safeParse(E).success)

  const F = Ok('12') // string and  option
  assert(schema.safeParse(F).success) // pass test

  const G = Err(12) // string and  option
  assert(schema.safeParse(G).success) // pass test
})

Deno.test('test-either-and-zod', () => {
  //先定义shema
  const schema = zod.either(zod.string(), zod.number()) // Either<string,number>

  const A = 12 // no string and no either
  assertFalse(schema.safeParse(A).success)

  const B = '12' // string and no either
  assertFalse(schema.safeParse(B).success)

  const C = { _tag: 'Ok', value: '12' } // no string and like either
  assertFalse(schema.safeParse(C).success)

  const D = Some(12) // either and no string
  assertFalse(schema.safeParse(D).success)

  const E = Some('12') // string and  either
  assertFalse(schema.safeParse(E).success)

  const F = Left('12') // string and  either
  assert(schema.safeParse(F).success) // pass test

  const G = Right(12) // string and  either
  assert(schema.safeParse(G).success) // pass test
})

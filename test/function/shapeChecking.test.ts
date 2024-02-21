import {shape_checking, zod} from 'lib'
import {assert, assertEquals} from '../mod.ts'

Deno.test('shape-checking', () => {
  const res = shape_checking({a: 1}, zod.object({a: zod.number()}))
  const res1 = shape_checking({a: 1}, zod.object({a: zod.string()}))

  const res2 = shape_checking({a: 1}, e => {
    if (e.a === 1) throw 'Error' // 任何 throw 都被作为错误错误信息返回
    return true // 只要返回true就是通过,返回false就是不通过,错误信息为 'shape_checking failed'
  })
  const res3 = shape_checking({a: 1}, e => e.a === 1)
  assertEquals({a: 1}, res.unwarp())
  assert(res1.is_err)

  assertEquals({a: 1}, res3.unwarp())
  res2.match_err(e => {
    assertEquals('Error', e)
  })
})

Deno.test('shape-checking with ZodSchema and valid input', () => {
  const res = shape_checking({a: 2}, zod.object({a: zod.number()}))
  assertEquals({a: 2}, res.unwarp())
})

Deno.test('shape-checking with ZodSchema and invalid input', () => {
  const res = shape_checking({a: 'invalid'}, zod.object({a: zod.number()}))
  assert(res.is_err)
})

Deno.test('shape-checking with function and valid input', () => {
  const res = shape_checking({a: 2}, e => e.a === 2)
  assertEquals({a: 2}, res.unwarp())
})

Deno.test('shape-checking with function and invalid input', () => {
  const res = shape_checking({a: 3}, e => e.a === 2)
  assert(res.is_err)
})

Deno.test('shape-checking with function that throws error', () => {
  const res = shape_checking({a: 3}, e => {
    if (e.a !== 3) throw 'Error'
    return true
  })
  assertEquals({a: 3}, res.unwarp())
})

Deno.test('shape-checking with function that throws error and invalid input', () => {
  const res = shape_checking({a: 2}, e => {
    if (e.a !== 3) throw 'Error'
    return true
  })
  res.match_err(e => {
    assertEquals('Error', e)
  })
})

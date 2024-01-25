import {Ok, Err, Fn} from '../../mod.ts'
import {ZodError, ZodSchema} from '../Ext/zod.ts'

/** ## shape_checking : 进行运行时的类型检查/校验
  @example
  ```ts
  const res = shape_checking({a: 1}, zod.object({a: zod.number()}))
  const res1 = shape_checking({a: 1}, zod.object({a: zod.string()}))

  const res2 = shape_checking({a: 1}, e => {
    if (e.a === 1) throw 'Error' // 任何 throw 都被作为错误错误信息返回
    return true // 返回true即通过;返回false即不通过,错误信息:'shape_checking failed'
  })
  const res3 = shape_checking({a: 1}, e => e.a === 1)
  assertEquals({a: 1}, res.unwarp())
  assert(res1.is_err)

  assertEquals({a: 1}, res3.unwarp())
  res2.match_err(e => {
    assertEquals('Error', e)
  })
  ```
  @category Function
 */
export function shape_checking<T, V extends ZodSchema | Fn<T, boolean>>(
  target: T,
  shape: V
): Result<T, V extends ZodSchema ? ZodError : unknown> {
  if (shape instanceof ZodSchema) {
    try {
      shape.parse(target)
    } catch (e) {
      return Err(e as ZodError)
    }
  } else {
    try {
      const res = shape(target)
      if (!res) return Err('shape_checking failed' as any)
    } catch (e) {
      return Err(e)
    }
  }
  return Ok(target)
}

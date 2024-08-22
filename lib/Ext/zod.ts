/**
[zod文档](https://zod.dev/README_ZH)
zod是一个Schema验证库,用于弥补Ts在运行时不具有类型检查的缺陷,能实现全链路的类型安全
@category ext
*/

export * from 'npm:zod@3.22.4'
import * as z from 'npm:zod@3.22.4'
import {
  type Fn,
  type Either,
  type Option,
  type Result,
  error_tag,
  left_tag,
  none_tag,
  ok_tag,
  right_tag,
  some_tag,
} from '../../mod.ts'

/** @ zod.option
@example 
```ts
const option = z.option(z.string())
const res = option.safeParse(Some('jiojio'))
assert(res.success)
```
@category Ext - zod
 */
export const option = <S extends z.Schema>(
  value: S
): z.ZodEffects<z.ZodAny, Option<z.infer<S>>, Option<z.infer<S>>> =>
  z.any().superRefine((val, ctx) => {
    val && (val._tag === some_tag || val._tag === none_tag)
      ? value.safeParse(val.value).success
        ? null
        : ctx.addIssue({
            code: 'custom',
            message: ' invalid option value type ',
          })
      : ctx.addIssue({ code: 'custom', message: 'not a Option type' })
  })

/** @ zod.resule 
@example
```ts
const result = z.result(z.string(), z.number())
const res = result.safeParse(Ok('jiojio'))
assert(res.success)
```
@category Ext - zod
*/
export const result = <T extends z.Schema, E extends z.Schema>(
  ok: T,
  err: E
): z.ZodEffects<z.ZodAny, Result<z.infer<T>, z.infer<E>>, any> =>
  z.any().superRefine((val, ctx) => {
    val && (val._tag === ok_tag || val._tag === error_tag)
      ? ok.safeParse(val.value).success || err.safeParse(val.value).success
        ? null
        : ctx.addIssue({
            code: 'custom',
            message: ' invalid result value type ',
          })
      : ctx.addIssue({ code: 'custom', message: 'not a Result type' })
  })

/** @ zod.either 
@example
```ts
const either = z.either(z.string(), z.number())
const res = either.safeParse(Left('jiojio'))
assert(res.success)
```
@category Ext - zod

*/
export const either = <L extends z.Schema, R extends z.Schema>(
  left: z.infer<L>,
  right: z.infer<R>
): z.ZodEffects<z.ZodAny, Either<z.infer<L>, z.infer<R>>, any> =>
  z.any().superRefine((val, ctx) => {
    val && (val._tag === left_tag || val._tag === right_tag)
      ? left.safeParse(val.left).success || right.safeParse(val.right).success
        ? null
        : ctx.addIssue({
            code: 'custom',
            message: ' invalid either value type ',
          })
      : ctx.addIssue({ code: 'custom', message: 'not a Eihter type' })
  })

type VisT<T extends { _type: unknown }> = (
  value: T['_type']
) => value is T extends z.Schema<infer R> ? R : never

/**
### validate : 以科里化的方式进行zod的类型校验
用于验证`value`是否符合`pattern`的类型    
`zod.validate(pattern)`  相当于  `pattern.safeParse().success`
@example
```ts
const pattern = z.string()
const res = zod.validate(pattern)('jiojio') // res is string
assert(res)
```
@category Ext - zod
 */
export const validate = <T extends z.Schema<unknown>>(pattern: T): VisT<T> =>
  ((value: unknown) => pattern.safeParse(value).success) as VisT<T>

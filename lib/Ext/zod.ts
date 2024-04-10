/**
[zod文档](https://zod.dev/README_ZH)
zod是一个Schema验证库,用于弥补Ts在运行时不具有类型检查的缺陷,能实现全链路的类型安全
@category ext
*/
export * from 'npm:zod'
import * as z from 'npm:zod'
import {
  Either,
  Option,
  Result,
  error_tag,
  left_tag,
  none_tag,
  ok_tag,
  right_tag,
  some_tag,
} from '../mod.ts'

export const option = <S extends z.Schema>(
  value: S
): z.ZodEffects<z.ZodAny, Option<z.infer<S>>, Option<z.infer<S>>> =>
  z.any().superRefine((val, ctx) => {
    val && (val._tag === some_tag || val._tag === none_tag)
      ? value.safeParse(val.value).success
        ? null
        : ctx.addIssue({code: 'custom', message: ' invalid option value type '})
      : ctx.addIssue({code: 'custom', message: 'not a Option type'})
  })

export const result = <T extends z.Schema, E extends z.Schema>(
  ok: T,
  err: E
): z.ZodEffects<z.ZodAny, Result<z.infer<T>, z.infer<E>>, any> =>
  z.any().superRefine((val, ctx) => {
    val && (val._tag === ok_tag || val._tag === error_tag)
      ? ok.safeParse(val.value).success || err.safeParse(val.value).success
        ? null
        : ctx.addIssue({code: 'custom', message: ' invalid result value type '})
      : ctx.addIssue({code: 'custom', message: 'not a Result type'})
  })

export const either = <L extends z.Schema, R extends z.Schema>(
  left: z.infer<L>,
  right: z.infer<R>
): z.ZodEffects<z.ZodAny, Either<z.infer<L>, z.infer<R>>, any> =>
  z.any().superRefine((val, ctx) => {
    val && (val._tag === left_tag || val._tag === right_tag)
      ? left.safeParse(val.left).success || right.safeParse(val.right).success
        ? null
        : ctx.addIssue({code: 'custom', message: ' invalid either value type '})
      : ctx.addIssue({code: 'custom', message: 'not a Eihter type'})
  })

// // z.ZodType.prototype
// Object.defineProperty(z.ZodType.prototype, 'validate', {
//   value: function (
//     data: unknown,
//     params?: Partial<z.ParseParams>
//   ): Result<typeof data, z.ZodError<any>> {
//     console.log(this)
//     const res = this.safeParse.call(this, data, params)
//     return res.success ? Ok(data) : Err(res.error)
//   },
//   writable: false,
//   configurable: false,
// })

import { Own } from "../Own.ts"
import { Err, Ok, Result } from "../Result.js"
import { flow, pipe } from "./mod.ts"

/** 对结果进行遍历尝试 */
export const try_then = (fn: (...args: any[]) => unknown, args: Array<unknown | Array<unknown>>, jud_fn: (...args: any[]) => boolean): Result<boolean, any> => {
  try {
    for (const arg of args) {
      Own(arg).is_array().match(
        () =>
          pipe(fn(...arg as Array<unknown>), jud_fn, Own)
            .match_true(() => {
              throw new Error('try_then: retrn_true')
            })
        , () =>
          pipe(arg, fn, jud_fn, Own)
            .match_true(() => {
              throw new Error('try_then: retrn_true')
            })
      )
    }
    throw new Error('try_then: retrn_false')
  } catch (error: any) {
    return error.message === 'try_then: retrn_true' ? Ok(true) : Err(error)
  }
}
/** 还要解决函数嵌套层级太深无法返回的问题 */
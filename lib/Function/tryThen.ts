import { BackTrack } from '../Error.ts'
import { Own } from '../Own.ts'
import { Err, Ok, Result } from '../Result.ts'
import { flow, pipe } from './mod.ts'

/** 对结果进行遍历尝试 */
export const try_then = (
  fn: (...args: any[]) => unknown,
  args: Array<unknown | Array<unknown>>,
  jud_fn: (...args: any[]) => boolean,
): Result<boolean, boolean> => {
  try {
    for (const arg of args) {
      Own(arg).is_array().match(
        () =>
          pipe(fn(...arg as Array<unknown>), jud_fn, Own)
            .match_true(() => {
              throw new BackTrack(null)
            }),
        () =>
          pipe(arg, fn, jud_fn, Own)
            .match_true(() => {
              throw new BackTrack(null)
            }),
      )
    }
    throw new Error('try_then: retrn_false')
  } catch (error: any) {
    return error instanceof BackTrack ? Ok(true) : Err(false)
  }
}
/** 使用BackTrack解决函数嵌套层级太深无法返回的问题 */

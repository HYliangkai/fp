import { type AnyResult, Err } from '@chzky/fp'
import { AnyError } from './anyError/anyError.ts'

const ERROR_CAUSE = 'this operation is illegal'

/** ## IllegalOperatError : 表示非法操作导致的错误,通常是致命的
+ 一般直接报错处理
@level `Fatal`
@category Error
 */
export class IllegalOperatError extends AnyError<'Fatal'> {
  constructor(cause = ERROR_CAUSE) {
    super('Fatal', cause, 'IllegalOperatError')
  }

  static override new(cause?: string): IllegalOperatError {
    return new IllegalOperatError(cause)
  }

  static override err(cause?: string): AnyResult<never, 'Fatal'> {
    return Err(IllegalOperatError.new(cause))
  }
}

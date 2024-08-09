import { type AnyResult, Err } from '@chzky/fp'
import { AnyError } from './anyError/anyError.ts'

/** ## UnexpectedError : 表示非预期的错误,通常是致命的 
- 一般直接报错处理
@level `Panic`
@category Error
 */
export class UnexpectedError extends AnyError<'Panic'> {
  constructor(cause = 'UnexpectedError') {
    super('Panic', cause, 'UnexpectedError')
  }

  static override new(cause = 'UnexpectedError'): UnexpectedError {
    return new UnexpectedError(cause)
  }

  static override err(cause = 'UnexpectedError'): AnyResult<never, 'Panic'> {
    return Err(UnexpectedError.new(cause))
  }
}

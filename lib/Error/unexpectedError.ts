import { Err } from '../../mod.ts'
import { AnyError, type AnyResult } from './anyError/mod.ts'

/** ## UnexpectedError : 表示非预期的错误,通常是致命的 */
export class UnexpectedError extends AnyError<'Fatal'> {
  constructor(cause = 'UnexpectedError') {
    super('Fatal', cause, 'UnexpectedError')
  }

  static new(cause = 'UnexpectedError'): UnexpectedError {
    return new UnexpectedError(cause)
  }

  static err(cause = 'UnexpectedError'): AnyResult<never, 'Fatal'> {
    return Err(UnexpectedError.new(cause))
  }
}

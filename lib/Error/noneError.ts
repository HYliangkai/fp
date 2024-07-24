import { Err } from '../../mod.ts'
import { AnyError, type AnyResult } from './anyError/mod.ts'

/** ## NoneError : 表示None类型的错误
  @category Error
 */
export class NoneError extends AnyError<'Error'> {
  constructor(cause = 'value is None') {
    super('Error', cause, 'NoneError')
  }
  static new(cause = 'value is None'): NoneError {
    return new NoneError(cause)
  }

  static err(cause = 'value is None'): AnyResult<never, 'Error'> {
    return Err(NoneError.new(cause))
  }
}

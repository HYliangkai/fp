import { Err } from '../../mod.ts'
import { AnyError, type AnyResult } from './anyError/mod.ts'

/** ## NoneError : 表示None类型的错误
@level `Error`
@category Error
 */
export class NoneError extends AnyError<'Error'> {
  constructor(cause = 'value is None') {
    super('Error', cause, 'NoneError')
  }
  /** ### new : 快速创建 */
  static override new(cause = 'value is None'): NoneError {
    return new NoneError(cause)
  }

  static override err(cause = 'value is None'): AnyResult<never, 'Error'> {
    return Err(NoneError.new(cause))
  }
}

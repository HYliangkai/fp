import { Err } from '../../mod.ts'
import { AnyError, type AnyResult } from './anyError/mod.ts'

/** ## NaNError : 结果为NaN的错误
@class Error
 */
export class NaNError extends AnyError<'Info'> {
  constructor(cause = 'value is NaN') {
    super('Info', cause, 'NaNError')
  }

  static new(cause = 'value is NaN'): NaNError {
    return new NaNError(cause)
  }

  static err(cause = 'value is NaN'): AnyResult<never, 'Error'> {
    return Err(NaNError.new(cause))
  }
}

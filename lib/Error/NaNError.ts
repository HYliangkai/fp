import { AnyError, type AnyResult, Err } from '../../mod.ts'

/** ## NaNError : 结果为NaN的错误
@level `Info`
@class Error
 */
export class NaNError extends AnyError<'Info'> {
  constructor(cause = 'value is NaN') {
    super('Info', cause, 'NaNError')
  }

  static override new(cause = 'value is NaN'): NaNError {
    return new NaNError(cause)
  }

  static override err(cause = 'value is NaN'): AnyResult<never, 'Error'> {
    return Err(NaNError.new(cause))
  }
}

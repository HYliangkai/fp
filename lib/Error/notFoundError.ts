import { AnyError, AnyResult, Err } from '../../mod.ts'

/** ## NotFoundError : 表示未找到指定的资源
@level `Error`
@category Error
 */
export class NotFoundError extends AnyError<'Error'> {
  constructor(cause = 'not found') {
    super('Error', cause, 'NotFoundError')
  }
  static override new(cause = 'not found'): NotFoundError {
    return new NotFoundError(cause)
  }

  static override err(cause = 'not found'): AnyResult<never, 'Error'> {
    return Err(NotFoundError.new(cause))
  }
}

import { AnyError, type AnyResult, Err } from '@chzky/fp'

/** ## NotSupportError : 表示不支持的操作导致的错误
相比较于`IllegalOperatError`，`NotSupportError`是一个更加轻量级的错误
@level `Error`
@category Error
*/
export class NotSupportError extends AnyError<'Error'> {
  constructor(cause = 'this operation is not supported') {
    super('Error', cause, 'NotSupportError')
  }

  static override new(cause = 'this operation is not supported'): NotSupportError {
    return new NotSupportError(cause)
  }

  static override err(cause = 'this operation is not supported'): AnyResult<never, 'Error'> {
    return Err(NotSupportError.new(cause))
  }
}

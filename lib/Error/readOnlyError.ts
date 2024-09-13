import { type AnyResult, Err, AnyError } from '@chzky/fp'

/** ## `ReadOnlyError` : 当数据是只读时,对数据进行修改操作会导致此错误 */
export class ReadOnlyError extends AnyError<'Error'> {
  constructor(cause = 'this value is readonly') {
    super('Error', cause, 'ReadOnlyError')
  }

  static override new(val?: string): ReadOnlyError {
    return new ReadOnlyError(`this value ${val} is readonly`)
  }

  static override err(val?: string): AnyResult<never, 'Fatal'> {
    return Err(new ReadOnlyError(`this value ${val} is readonly`))
  }
}

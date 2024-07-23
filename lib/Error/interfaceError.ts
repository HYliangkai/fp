import { AnyError, type AnyResult, Err } from '../../mod.ts'
const CAUSE = 'not implements'
/** ## NotImplementsError : 未实现对应接口错误错误 */
export class NotImplementsError extends AnyError<'Error'> {
  constructor(interface_name?: string) {
    super('Error', CAUSE + interface_name, 'NotImplementsError')
  }

  static new(interface_name = ''): NotImplementsError {
    return new NotImplementsError(interface_name)
  }

  static err(interface_name = ''): AnyResult<never, 'Error'> {
    return Err(NotImplementsError.new(interface_name))
  }
}

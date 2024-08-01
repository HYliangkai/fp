import { type AnyResult, Err } from '../../mod.ts'
import { AnyError } from './anyError/anyError.ts'

const CAUSE = 'not implements'
/** ## NotImplementsError : 未实现对应接口错误错误
@level `Error`
@category Error
 */
export class NotImplementsError extends AnyError<'Error'> {
  constructor(interface_name?: string) {
    super('Error', CAUSE + interface_name, 'NotImplementsError')
  }

  static override new(interface_name = ''): NotImplementsError {
    return new NotImplementsError(interface_name)
  }

  static override err(interface_name = ''): AnyResult<never, 'Error'> {
    return Err(NotImplementsError.new(interface_name))
  }
}

import { AnyError, type Result, Err } from '@chzky/fp'

/** ## `MultipleError` : 多重错误 
+ 用于表示多个错误的错误,通常在多个Promise合并操作中使用
@example
```ts
const err1 = new AnyError('Error', 'err1')
const err2 = new AnyError('Error', 'err2')
const err3 = new AnyError('Error', 'err3')

const err = MultipleError.new().append(err1).append(err2).append(err3)
console.log(err.cause()) // err1:err1\nerr2:err2\nerr3:err3\n

```
@level `Error`
@category Error
*/
export class MultipleError<E extends Array<AnyError>> extends AnyError<'Error'> {
  private _errors: Array<AnyError>

  constructor(erros: E) {
    const cause = erros.reduce((acc, cur) => acc + `${cur.name()}:${cur.cause()}\n`, '')
    super('Error', cause, 'MultipleError')
    this._errors = erros
  }

  static override new(_exp?: string): MultipleError<[]> {
    return new MultipleError([])
  }

  static override err(_exp?: string): Result<never, MultipleError<[]>> {
    return Err(MultipleError.new())
  }

  /** ### `append` : 追加错误 */
  append<N extends AnyError>(err: N): MultipleError<[...E, N]> {
    this._errors.push(err)
    this._cause = this._errors.reduce((acc, cur) => acc + `${cur.name()}:${cur.cause()}\n`, '')
    return this as unknown as MultipleError<[...E, N]>
  }

  /** ### `errors` : 获取错误列表 */
  erros(): Array<AnyError> {
    return this._errors
  }
}

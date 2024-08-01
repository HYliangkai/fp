import { Err, AnyError, type Result, type ErrorLevel, type AsyncResult } from '../../../mod.ts'

/** ## AnyResult : 错误类型为 {@link AnyError} 的 {@link Result }
  @category Error */
export type AnyResult<T, E extends ErrorLevel = ErrorLevel> = Result<T, AnyError<E>>

/** ## AsyncAnyResult : 对 {@link AnyResult} 的异步封装
  @category Error */
export type AsyncAnyResult<T, E extends ErrorLevel = ErrorLevel> = AsyncResult<T, AnyError<E>>

/** ## ## AnyErr : 一个快速创建AnyError的函数
  @example
  ```ts
  const err = AnyErr('Error','test error')
  assert(err.type === 'Error')//Pass
  assert(err.cause === 'test error')//Pass
  assert(err.name === 'AnyError')//Pass
  ```
  @category TypeClass
*/
export const AnyErr = <T extends ErrorLevel>(
  type: T,
  cause?: string,
  name?: string
): Result<never, AnyError<T>> => Err(new AnyError(type, cause, name))

/** ## panic : 以函数的形式快速抛出一个AnyError类型的异常,通常搭配
用于解决语句执行中不能随时返回AnyError的问题
@example
```ts
assertThrow(panic('Error','test error'))//Pass

  try{
  panic()
  }catch(e){// catch AnyError
  assert(e.type==='Panic')//Pass
  }

```
@category Error
 */
export function panic(type: ErrorLevel = 'Panic', cause = 'error...', name = 'Painc-Fn'): never {
  throw new AnyError(type, cause, name)
}

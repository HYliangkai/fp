import type {
  AnyError,
  As,
  Default,
  Either,
  error_tag,
  Fn,
  Monad,
  NoneError,
  ok_tag,
  Option,
} from '../../../mod.ts'

export type ResultIntoFlag = 'option' | 'either'

/** ## Result
`Result<O, E>`是用于返回和传播错误的类型。
它是一个具有变量的TypeClass， `Ok(O)`表示成功并包含一个值， `Err(E)`表示错误并包含一个错误值。
只要错误是预期的和可恢复的，函数就返回`Result`
*/
export interface Result<O, E>
  extends Monad<typeof error_tag, typeof ok_tag>,
    As<boolean, 'boolean'> {
  readonly _tag: typeof error_tag | typeof ok_tag
  readonly value: O | E
  readonly is_ok: boolean
  readonly is_err: boolean

  /** ### unwrap
  返回包含的 `Ok` 值 , 如果值是 `Err` 则抛出异常 */
  unwrap(): O
  /** ### expect
  返回包含的 `Ok` 值 , 如果值是 `Err` 则抛出异常 err, 相当于做`Err替换`*/
  expect(err: unknown): O
  /** ### unwrap_or
  返回包含的 `Ok` 值 , 如果值是 `Err` 则返回默认值 def */
  unwrap_or<R>(def: R): O | R
  /** ### unwrap_or_else
  返回包含的 `Ok` 值 , 如果值是 `Err` 则返回 fn() */
  unwrap_or_else<R>(fn: Fn<E, R>): R | O
  /** ### unwrap_or_default
  返回包含的 `Ok` 值 , 如果值是 `Err` 则返回传入的值的default调用 */
  unwrap_or_default<D>(def: Default<D>): O | D
  /** ### unwrap_err
  返回包含的 `Err` 值 , 如果值是 `Ok` 则返回`AnyError<'Error'>` */
  unwrap_err(): E | AnyError<'Error'>

  /** ### map
  通过将提供的函数应用于 `Ok` 的包含值并保持 `Err` 值不变，将 `Result<T, E>` 转换为 `Result<U, E>` */
  map<R>(fn: Fn<O, R>): Result<R, E>
  /** ### map_err
  通过将提供的函数应用于 `Err` 的包含值并保持 `Ok` 值不变，将 `Result<O, T>` 转换为 `Result<O, R>` */
  map_err<R>(fn: Fn<E, R>): Result<O, R>
  /** ### and_then
  将数据在回调函数`fn`中执行,进行重新处理
  */
  and_then<R>(fn: Fn<Result<O, E>, R>): R

  /** ### match_ok
  如果是`Ok`就执行回调函数
  */
  match_ok(fn: Fn<O, void>): void
  /** ### match_err
  如果是`Err`就执行回调函数
  */
  match_err(fn: Fn<E, void>): void
  /** ### match
  如果是`Ok`就执行ok回调函数,如果是`Err`就执行err回调函数
   */
  match(ok: Fn<O, void>, err: Fn<E, void>): void

  /** ### into : 实现{@link Into}接口
  转换规则 :
  + `Ok(O)`  -> `Some<O>` | `Left<O>`
  + `Err(E)` -> `None` | `Right<E>`
   */
  into<R extends ResultIntoFlag>(
    flag: R
  ): R extends 'option' ? Option<O> : R extends 'either' ? Either<O, E> : never

  /** ### as : 实现{@link As}接口
  转换规则 :
  + `Ok(O)`  -> `true`
  + `Err(E)` -> `false`
  */
  as<R extends 'boolean'>(flag: R): R extends 'boolean' ? boolean : never
}

/** ## AsyncResult : 对Result类型的异步封装
  @category TypeClass */
export type AsyncResult<O, E> = Promise<Result<O, E>>

export interface ResultConstructor {
  /** ## result : 将一个可能throw的 `同步` 语句/代码/函数 转化为`Result<[return value],[throw value]>`类型数据 , 旨在解决正常函数转化为Result的问题
  @example
  ```ts
  const res = result(() => {
    if (Math.random() > 0.5) {
      return 1
    } else {
      throw new Error('test error')
    }
  })
  res.match_ok(val => {
    console.log(val) // 1
  })
  ```
  @category TypeClass
 */
  <O, E = unknown>(fn: () => O): Result<O, E>
  /** ## result.async : {@link result}的异步版本

  @description
    将一个可能throw的普通`异步` 语句/代码/函数 转化为Result<(return value),(throw value)>类型
  @example
  ```ts
  const res = result(() => {
    if (Math.random() > 0.5) {
      return 1
    } else {
      throw new Error('test error')
    }
  })
  res.match_ok(val => {
    console.log(val) // 1
  })
  ```
  @category TypeClass
  */
  async<O, E = unknown>(fn: () => Promise<O>): AsyncResult<O, E>

  /** ### from : 实现{@link From}接口  */
  from<T>(val: Option<T>): Result<T, NoneError>
}

import type {
  AnyError,
  Default,
  Either,
  error_tag,
  Fn,
  Into,
  ok_tag,
  Option,
} from '../../../mod.ts'

export type ResultIntoFlag = 'option' | 'either'

/** ## Result 
`Result<O, E>`是用于返回和传播错误的类型。  
它是一个具有变量的TypeClass， `Ok(O)`表示成功并包含一个值， `Err(E)`表示错误并包含一个错误值。  
只要错误是预期的和可恢复的，函数就返回`Result`
*/
export interface Result<O, E> extends Into<Option<O> | Either<O, E>, ResultIntoFlag> {
  _tag: typeof error_tag | typeof ok_tag
  value: O | E
  is_ok: boolean
  is_err: boolean

  /** ### unwarp 
  返回包含的 `Ok` 值 , 如果值是 `Err` 则抛出异常 */
  unwarp(): O
  /** ### expect 
  返回包含的 `Ok` 值 , 如果值是 `Err` 则抛出异常,异常值为 msg */
  expect<R>(msg: R): O
  /** ### unwarp_or 
  返回包含的 `Ok` 值 , 如果值是 `Err` 则返回默认值 def */
  unwarp_or<R>(def: R): O | R
  /** ### unwarp_or_else 
  返回包含的 `Ok` 值 , 如果值是 `Err` 则返回 fn() */
  unwrap_or_else<R>(fn: Fn<E, R>): R | O
  /** ### unwarp_or_default 
  返回包含的 `Ok` 值 , 如果值是 `Err` 则返回传入的值的default调用 */
  unwarp_or_default<D>(def: Default<D>): O | D
  /** ### unwarp_err 
  返回包含的 `Err` 值 , 如果值是 `Ok` 则返回`AnyError<'Error'>` */
  unwarp_err(): E | AnyError<'Error'>
  /** ### map 
  通过将提供的函数应用于 `Ok` 的包含值并保持 `Err` 值不变，将 `Result<T, E>` 转换为 `Result<U, E>` */
  map<R>(fn: Fn<O, R>): Result<R, E>
  /** ### map_err 
  通过将提供的函数应用于 `Err` 的包含值并保持 `Ok` 值不变，将 `Result<O, T>` 转换为 `Result<O, R>` */
  map_err<R>(fn: Fn<E, R>): Result<O, R>
  /** ### and_then 
  将数据重新进行处理
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
}

/** ## AsyncResult : 对Result类型的异步封装 
  @category TypeClass */
export type AsyncResult<O, E> = Promise<Result<O, E>>

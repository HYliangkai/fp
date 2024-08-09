import type {
  As,
  Default,
  Either,
  Fn,
  FnReturn,
  none_tag,
  NoneError,
  Option,
  PartialEq,
  Result,
  some_tag,
} from '../../../mod.ts'

type OptionIntoFlag = 'result' | 'either'

export interface option<T> extends As<boolean, 'boolean'>, PartialEq {
  readonly _tag: typeof some_tag | typeof none_tag

  /** 是否为Some */
  readonly is_some: boolean
  /** 是否为None */
  readonly is_none: boolean
  /** ### unwrap : 获取值,如果为`None`就抛异:{@link NoneError} */
  unwrap(): T
  /** ### expect : 获取值抛异,如果为`None`就抛异,err作为错误抛出 */
  expect<E = unknown>(err: E): T
  /** ### unwrap_or : 获取值,如果为None就返回`def` */
  unwrap_or<R>(def: R): T | R
  /** ### unwrap_or_else : 获取值,如果为`None`就执行fn */
  unwrap_or_else<R>(fn: FnReturn<R>): T | R
  /** ### unwrap_or_default : 获取值,如果为`None`则返回传入的值的default调用 */
  unwrap_or_default<R>(value: Default<R>): T | R

  /** ### map : 如果为`Some`调用callback结果替换Some值 */
  map<R>(callback: Fn<T, R>): Option<R>
  /** ### and_then : 将`Options`数据进行转换 */
  and_then<R>(callback: Fn<Option<T>, R>): R

  /** ### some_do : 如果为`Some`就执行 */
  some_do(fn: Fn<T, unknown>): void
  /** ### none_do : 如果为`None`就执行 */
  none_do(fn: FnReturn<unknown>): void
  /** ### match : `Some`|`None` 的回调执行 */
  match(some: Fn<T, unknown>, none: FnReturn<unknown>): void

  /** ### into : 实现{@link Into}接口
  转换规则 :
  + `Ok(O)`  -> `Some<O>` | `Left<O>`
  + `Err(E)` -> `None` | `Right<E>`
   */
  into<R extends OptionIntoFlag>(
    flag: R
  ): R extends 'result' ? Result<T, NoneError> : R extends 'either' ? Either<T, NoneError> : never

  /** ### as : 实现{@link As}接口
  转换规则 :
  + `Some(O)`  -> `true`
  + `None` -> `false`
  */
  as<R extends 'boolean'>(flag: R): R extends 'boolean' ? boolean : never
}

/** Result */
import { None, Option, option, Some } from './Option.ts'
import { Own } from './Own.ts'
interface Ok<T> {
  readonly _tag: 'ok'
  readonly value: T
  /** 是否是`Ok` */
  is_ok(): true
  /** 是否是`Err` */
  is_err(): false
  /** 获取值,如果为`Err`就抛异 */
  unwarp(): T
  /** 获取值,如果为`Err`就用def替代 */
  unwarp_or(def: T): T
  /** 获取值,如果为`Err`就用fn()替代 */
  unwrap_or_else(fn: () => T): T
  /** 转化为`Option`类型的数据:注意如果`Ok`里面有`null`|`underfind`会转化成`None` */
  to_option(): Option<T>
  /** `Result<T, E>`  -->  `Result<V, E>` */
  map(fn: () => T): Result<T, never>
  /** `Result<T, E>`  -->  `Result<V, E>` */
  and_then<E>(fn: () => Result<T, E>): Result<T, E>
  to_own(def: T): Own<T>
}

interface Err<E> {
  _tag: 'error'
  value: E
  is_ok(): false
  is_err(): true
  unwarp(): never
  unwarp_or<V>(def: V): V
  unwrap_or_else<V>(fn: () => V): V
  to_option(): Option<never>
  map<V>(fn: () => V): Result<V, E>
  and_then<T>(fn: () => Result<T, E>): Result<T, E>
  to_own<T>(def: T): Own<T>
}

export type Result<T, E> = Ok<T> | Err<E>

/** 定义为正确的 */
export function Ok<T>(value: T): Result<T, never> {
  return {
    _tag: 'ok',
    value: value,
    is_ok() {
      return true
    },
    is_err() {
      return false
    },
    unwarp() {
      return this.value
    },
    unwarp_or(_def: T) {
      return this.value
    },
    unwrap_or_else(_fn) {
      return this.value
    },
    to_option() {
      if (typeof this.value !== undefined && this.value !== null) {
        return Some(this.value as any)
      } else {
        return None
      }
    },
    map(fn) {
      return Ok(fn())
    },
    and_then(fn) {
      return fn()
    },
    to_own(_def) {
      return Own(this.value)
    },
  }
}

/** 定义为错误的 */
export function Err<E>(value: E): Result<never, E> {
  return {
    _tag: 'error',
    value,
    is_ok() {
      return false
    },
    is_err() {
      return true
    },
    unwarp() {
      if (this.value instanceof Error) throw this.value
      else throw new Error(String(this.value))
    },
    unwarp_or<V>(def: V) {
      return def
    },
    unwrap_or_else(fn) {
      return fn()
    },
    to_option() {
      return None
    },
    map(_fn) {
      return this
    },
    and_then(_fn) {
      return this
    },
    to_own(def) {
      return Own(def)
    },
  }
}

/** 将一个可能throw的语句转化为Result<T, E>类型数据 | 如果是async用Promise来处理 */
export function result<T, E = unknown>(
  fn: () => T,
): Result<T, E> {
  try {
    return Ok(fn())
  } catch (err: any) {
    return Err(err)
  }
}

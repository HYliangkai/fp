/** Result */

import {BackTrack, Either, Left, NoError, None, Option, Right, Some} from './mod.ts'

const error_tag = Symbol('error')
const ok_tag = Symbol('ok')

interface Ok<T> {
  readonly _tag: typeof ok_tag
  readonly value: T
  /** 是否是`Ok` */
  is_ok: true
  /** 是否是`Err` */
  is_err: false
  /** 获取值,如果为`Err`就抛异 */
  unwarp(): T
  /** 获取值,如果为`Err`就用def替代 */
  unwarp_or(def: T): T
  /** 获取Error */
  unwarp_err(): NoError
  /** 获取值,如果为`Err`就用fn()替代 */
  unwrap_or_else(fn: (err: never) => T): T
  /** 转化为`Option`类型的数据:注意如果`Ok`里面有`null`|`underfind`会转化成`None` */
  to_option(): Option<T>
  /** `Result<T, E>`  -->  `Result<V, E>` */
  map(fn: () => T): Result<T, never>
  /** `Result<T, E>`  -->  `Result<V, E>` */
  and_then<E>(fn: () => Result<T, E>): Result<T, E>

  /** ok情况的handle */
  match_ok<V>(fn: (val: T) => void): void
  /** error情况的handle */
  match_err<V>(fn: (val: V) => void): void
  /** Ok -> Left / Err -> Righr */
  to_either: <E>() => Either<T, E>
}

interface Err<E> {
  _tag: typeof error_tag
  value: E
  is_ok: false
  is_err: true
  unwarp(): never
  unwarp_err(): E
  unwarp_or<V>(def: V): V
  unwrap_or_else<V>(fn: (err: E) => V): V
  to_option(): Option<never>
  map<V>(fn: () => V): Result<V, E>
  and_then<T>(fn: () => Result<T, E>): Result<T, E>
  match_ok<V>(fn: (val: V) => void): void
  match_err(fn: (val: E) => void): void
  to_either: <T>() => Either<T, E>
}

export type Result<T, E> = Ok<T> | Err<E>

/** 定义为正确的 */
export function Ok<T>(value: T): Result<T, never> {
  return {
    _tag: ok_tag,
    value: value,
    is_ok: true,
    is_err: false,
    unwarp() {
      return this.value
    },
    unwarp_or(_def: T) {
      return this.value
    },
    unwarp_err() {
      return new NoError()
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

    match_ok(fn) {
      fn(this.value)
    },
    match_err(_fn) {},
    to_either() {
      return Left(this.value)
    },
  }
}

/** 定义为错误的 */
export function Err<E>(value: E): Result<never, E> {
  return {
    _tag: error_tag,
    value,
    is_ok: false,
    is_err: true,
    unwarp() {
      if (this.value instanceof Error) throw this.value
      else throw new Error(String(this.value))
    },
    unwarp_or<V>(def: V) {
      return def
    },
    unwarp_err() {
      return this.value
    },
    unwrap_or_else(fn) {
      return fn(this.value)
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
    match_ok(_fn) {},
    match_err(fn) {
      fn(this.value)
    },
    to_either() {
      return Right(this.value)
    },
  }
}

/** 解决result()中嵌套过深无法返回的问题 */
export function backtrack<T>(val: T) {
  throw new BackTrack(val)
}

/** 将一个可能throw的 语句/代码/函数 转化为Result<T, E>类型数据

      `注意:`只能处理同步代码的情况
 */
export function result<T, E = unknown>(fn: () => T): Result<T, E> {
  try {
    const res = fn()
    return Ok(res)
  } catch (err: any) {
    return err instanceof BackTrack ? Ok(err.return_val) : Err(err)
  }
}

/**  运行时判断是否Result类型 */
export function is_result<T = unknown, E = unknown>(val: any): val is Result<T, E> {
  return val._tag === ok_tag || val._tag === error_tag
}

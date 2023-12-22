/** Result */

import {AnyError, AnyResult, ErrorLevel, match_error} from '../mod.ts'
import {Either, Left, None, Option, Right, Some} from './TypeClass/mod.ts'

interface ErrorHandle {
  debug: (func: (v: AnyError<'Debug'>) => AnyResult<unknown>) => void
  info: (func: (v: AnyError<'Info'>) => AnyResult<unknown>) => void
  error: (func: (v: AnyError<'Error'>) => AnyResult<unknown>) => void
  warn: (func: (v: AnyError<'Warn'>) => AnyResult<unknown>) => void
  fatal: (func: (v: AnyError<'Fatal'>) => AnyResult<unknown>) => void
  panic: (func: (v: AnyError<'Panic'>) => AnyResult<unknown>) => void
}

export const error_tag = Symbol('error')
export const ok_tag = Symbol('ok')

interface Ok<T> {
  readonly _tag: typeof ok_tag
  readonly value: T
  /** 是否是`Ok` */
  is_ok: true
  /** 是否是`Err` */
  is_err: false
  /** get value,if value is `Err` , throw an exception  */
  unwarp(): T
  /** 如果为None就抛异,msg作为错误信息 */
  expect<V>(msg: V): T
  /** get value,if value is `Err` , Replace it with def */
  unwarp_or(def: T): T
  /** get Error value */
  unwarp_err(): AnyError<'Error'>
  /** get value,if value is `Err` , Replace it with fn() */
  unwrap_or_else(fn: (err: never) => T): T
  /** 转化为`Option`类型的数据:注意如果`Ok`里面有`null`|`underfind`会转化成`None` */
  to_option(): Option<T>
  /** `Result<T, E>`  -->  `Result<V, E>` */
  map<V>(fn: (val: T) => V): Result<V, never>
  /** `AnyResult<T>` --> `ANyResult<V>` : 用于对可恢复错误进行恢复 */
  map_err(fn: any): AnyResult<unknown>
  /** `Result<T, E>`  -->  `Result<V, E>` */
  and_then<E>(fn: () => Result<T, E>): Result<T, E>
  /** handle of ok */
  match_ok(fn: (val: T) => void): void
  /** handle of error */
  match_err<V>(fn: (val: V) => void): void
  /** Ok -> Left / Err -> Righr */
  to_either: <E>() => Either<T, E>
}

interface Err<E> {
  _tag: typeof error_tag
  value: E
  is_ok: false
  is_err: true
  unwarp_err(): E
  unwarp(): never
  unwarp_or<V>(def: V): V
  expect<V>(msg: V): never
  unwrap_or_else<V>(fn: (err: E) => V): V
  to_option(): Option<never>
  map<V>(fn: (val: E) => V): Result<V, E>
  map_err(fn: E extends AnyError ? (handle: ErrorHandle) => unknown : never): AnyResult<unknown>
  and_then<T>(fn: () => Result<T, E>): Result<T, E>
  match_ok<V>(fn: (val: V) => void): void
  match_err(fn: (val: E) => void): void
  to_either: <T>() => Either<T, E>
}

export type Result<T, E> = Ok<T> | Err<E>
export type AsyncResult<T, E> = Promise<Ok<T> | Err<E>>
const empty_tag = Symbol('empty')
/** 定义为正确的 */
export function Ok<T = void>(value?: T): Result<T, never> {
  {
    //@ts-ignore
    arguments.length === 0 ? (value = empty_tag) : null
  }
  return {
    _tag: ok_tag,
    //@ts-ignore
    value: value,
    is_ok: true,
    is_err: false,
    unwarp() {
      return this.value
    },
    expect<V>(_msg: V) {
      return this.value
    },
    unwarp_or(_def: T) {
      return this.value
    },
    unwarp_err() {
      return AnyError.new('Error', 'Ok value not error')
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
      return Ok(fn(this.value))
    },
    map_err(_fn) {
      return this as any
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
      else throw this.value
    },
    expect<V>(msg: V) {
      throw msg
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
    map_err(fn: any) {
      if (this.value instanceof AnyError) {
        let retdswd: any = Err(this.value)
        const wqdq121 = this.value as AnyError<ErrorLevel>
        const debug = (func: (v: AnyError<'Debug'>) => AnyResult<unknown>) => {
          wqdq121.type == 'Debug' ? (retdswd = func(wqdq121)) : null
        }
        const info = (func: (v: AnyError<'Info'>) => AnyResult<unknown>) => {
          wqdq121.type == 'Info' ? (retdswd = func(wqdq121)) : null
        }
        const error = (func: (v: AnyError<'Error'>) => AnyResult<unknown>) => {
          wqdq121.type == 'Error' ? (retdswd = func(wqdq121)) : null
        }
        const warn = (func: (v: AnyError<'Warn'>) => AnyResult<unknown>) => {
          wqdq121.type == 'Warn' ? (retdswd = func(wqdq121)) : null
        }
        const fatal = (func: (v: AnyError<'Fatal'>) => AnyResult<unknown>) => {
          wqdq121.type == 'Fatal' ? (retdswd = func(wqdq121)) : null
        }
        const panic = (func: (v: AnyError<'Panic'>) => AnyResult<unknown>) => {
          wqdq121.type == 'Panic' ? (retdswd = func(wqdq121)) : null
        }
        fn({debug, info, error, warn, fatal, panic})
        return retdswd
      } else {
        return AnyErr('Info', 'must be AnyError can use map_err()', 'map_err')
      }
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

/** AnyError类型的错误 */
export const AnyErr = (type: ErrorLevel, cause?: string, name?: string) =>
  Err(AnyError.new(type, cause, name))

export class BackTrack<T> {
  public return_val: T
  constructor(val: T) {
    this.return_val = val
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

export function anyresult<T>(fn: () => T): AnyResult<T> {
  try {
    //@ts-ignore
    return Ok(fn())
  } catch (err) {
    //@ts-ignore
    return err instanceof BackTrack
      ? Ok(err.return_val as T)
      : Err(match_error(err).handle_throw(err => err))
  }
}

/**  运行时判断是否Result类型 */
export function is_result<T = unknown, E = unknown>(val: any): val is Result<T, E> {
  return val._tag === ok_tag || val._tag === error_tag
}

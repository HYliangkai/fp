/** Result */

import {AnyError, AnyResult, ErrorLevel, match_error} from '../../mod.ts'
import {Either, Left, None, Option, Right, Some} from './mod.ts'

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
const empty_tag = Symbol('empty')

/** ## Result : 一个可能为Ok或者Err的数据类型
  @category TypeClass */
export type Result<T, E> = Ok<T> | Err<E>

/** ## AsyncResult : 对Result类型的异步封装 
  @category TypeClass */
export type AsyncResult<T, E> = Promise<Ok<T> | Err<E>>

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

class ok<T = void> implements Ok<T> {
  value: T
  _tag: typeof ok_tag
  is_ok: true
  is_err: false
  constructor(val: T) {
    this.value = val
    this._tag = ok_tag
    this.is_ok = true
    this.is_err = false
  }
  unwarp() {
    return this.value
  }
  expect<V>(_msg: V) {
    return this.value
  }
  unwarp_or(_def: T) {
    return this.value
  }
  unwarp_err() {
    return AnyError.new('Error', 'Ok value not error')
  }
  unwrap_or_else(_fn: Function) {
    return this.value
  }
  to_option() {
    if (typeof this.value !== undefined && this.value !== null) {
      return Some(this.value as any)
    } else {
      return None
    }
  }
  map(fn: Function) {
    return Ok(fn(this.value))
  }
  //@ts-ignore
  map_err(_fn: Function) {
    return this
  }
  and_then(fn: Function) {
    return fn()
  }
  match_ok(fn: Function) {
    fn(this.value)
  }
  match_err(_fn: Function) {}
  to_either() {
    return Left(this.value)
  }
}

/** 定义为正确的 */
export function Ok<T = void>(value?: T): Result<T, never> {
  arguments.length === 0 ? ((value as any) = empty_tag) : null
  return new ok(value!)
}

class err<E> implements Err<E> {
  value: E
  _tag: typeof error_tag
  is_err: true
  is_ok: false
  constructor(val: E) {
    this.value = val
    this._tag = error_tag
    this.is_err = true
    this.is_ok = false
  }

  unwarp(): never {
    if (this.value instanceof Error) throw this.value
    throw this.value
  }
  expect<V>(msg: V): never {
    throw msg
  }
  unwarp_or<V>(def: V) {
    return def
  }
  unwarp_err() {
    return this.value
  }
  unwrap_or_else(fn: Function) {
    return fn(this.value)
  }
  to_option() {
    return None
  }
  map(_fn: Function) {
    return this
  }
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
      return AnyErr('Info', 'must be AnyError can use map_err', 'map_err')
    }
  }
  and_then(_fn: Function) {
    return this
  }
  match_ok(_fn: Function) {}
  match_err(fn: Function) {
    fn(this.value)
  }
  to_either() {
    return Right(this.value)
  }
}

/** ## Err : 定义一个E类型的错误 */
export function Err<E>(value: E): Result<never, E> {
  return new err(value)
}

/** ## AnyErr : 定义一个AnyError类型的错误 */
export const AnyErr = <T extends ErrorLevel>(
  type: T,
  cause?: string,
  name?: string
): Result<never, AnyError<T>> => Err(AnyError.new(type, cause, name))

/** @Helper_Function  */

export class BackTrack<T> {
  public return_val: T
  constructor(val: T) {
    this.return_val = val
  }
}

/** 解决result()中嵌套过深无法返回的问题,可以作为result()函数中的return使用 */
export function backtrack<T>(val: T) {
  throw new BackTrack(val)
}

/** ## result : 将一个可能throw的 `同步` 语句/代码/函数 转化为Result<(return value),(throw value)>类型数据
  @example
  //Todo
  @category TypeClass 
 */
export function result<T, E = unknown>(fn: () => T): Result<T, E> {
  try {
    const res = fn()
    return Ok(res)
  } catch (err: any) {
    return err instanceof BackTrack ? Ok(err.return_val) : Err(err)
  }
}

/** ## result : 将一个可能throw的 `异步` 语句/代码/函数 转化为Result<(return value),(throw value)>类型数据
  @example
  //Todo
  @category TypeClass
*/
export async function async_result<T, E = unknown>(fn: () => Promise<T>): AsyncResult<T, E> {
  try {
    const res = await fn()
    return Ok(res)
  } catch (err: any) {
    return err instanceof BackTrack ? Ok(err.return_val) : Err(err)
  }
}

/** ## anyresult :  MayBe Throw Function --> AnyResult<T>
  @example
  //Todo
  @category TypeClass
*/
export function anyresult<T>(fn: () => T): AnyResult<T> {
  try {
    return Ok(fn())
  } catch (err) {
    return err instanceof BackTrack
      ? Ok(err.return_val as T)
      : Err(match_error(err).handle_throw(err => err))
  }
}

/** ## is_result : 运行时判断是否Result类型 
  @example
  //Todo
  @category TypeClass
*/
export function is_result<T = unknown, E = unknown>(val: any): val is Result<T, E> {
  return val._tag === ok_tag || val._tag === error_tag
}

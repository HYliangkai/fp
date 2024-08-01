import {
  type Default,
  type Either,
  type Fn,
  type FnReturn,
  Left,
  None,
  type NoneError,
  Ok,
  type Option,
  type Result,
  some_tag,
} from '../../../mod.ts'
import type { option } from './interface.ts'

export interface Some<T> extends option<T> {
  readonly _tag: typeof some_tag
  readonly value: T
}

class some<T> implements Some<T> {
  readonly value: T
  constructor(val: T) {
    if (typeof val === 'undefined' || val === null)
      throw new TypeError('cannot create Some from null or undefined')

    this.value = val
    this._tag = some_tag
    this.is_some = true
    this.is_none = false
  }
  readonly _tag: typeof some_tag
  readonly is_some: boolean
  readonly is_none: boolean

  unwarp(): T {
    return this.value
  }
  expect(_err: unknown): T {
    return this.unwarp()
  }
  unwrap_or<R>(_def: R): T {
    return this.unwarp()
  }
  unwrap_or_else<R>(_fn: FnReturn<R>): T {
    return this.unwarp()
  }
  unwrap_or_default<R>(_value: Default<R>): T | R {
    return this.unwarp()
  }
  map<R>(callback: Fn<T, R>): Option<R> {
    const r = callback(this.unwarp())
    if (r === undefined || r === null) return None
    return new some(r)
  }
  and_then<R>(callback: Fn<Option<T>, R>): R {
    return callback(this as unknown as Option<T>)
  }
  some_do(fn: Fn<T, unknown>): void {
    fn(this.value)
  }
  none_do(_fn: FnReturn<unknown>): void {}
  match(some: Fn<T, unknown>, _none: FnReturn<unknown>): void {
    some(this.unwarp())
  }

  into<R extends 'result' | 'either'>(
    flag: R
  ): R extends 'result' ? Result<T, NoneError> : R extends 'either' ? Either<T, NoneError> : never {
    if (flag === 'result') {
      return Ok(this.value) as any
    } else if (flag === 'either') {
      return Left(this.value) as any
    } else {
      throw new TypeError('not match into')
    }
  }

  as<R extends 'boolean'>(flag: R): R extends 'boolean' ? boolean : never {
    if (flag === 'boolean') return true as any
    throw new TypeError('not match as')
  }
}

/** ## Some
  + 将一个值转化为Some类型
  + 如果值为null/underfind 就抛出异常
  + 如果值为其他类型就转化为Some类型
  @throws TypeError
  @category TypeClass
 */
export function Some<T>(val: NonNullable<T>): Option<T> {
  return new some(val)
}

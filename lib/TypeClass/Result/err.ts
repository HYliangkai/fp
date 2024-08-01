import {
  type Fn,
  type Either,
  type Option,
  None,
  Right,
  error_tag,
  type Default,
} from '../../../mod.ts'
import type { Result, ResultIntoFlag, Err } from './interface.ts'

class err<E> implements Err<E> {
  readonly value: E
  readonly _tag: typeof error_tag
  readonly is_err: true
  readonly is_ok: false
  constructor(val: E) {
    this.value = val
    this._tag = error_tag
    this.is_err = true
    this.is_ok = false
  }

  as<R extends 'boolean'>(flag: R): R extends 'boolean' ? false : never {
    if (flag === 'boolean') return false as any
    throw new TypeError('not match as')
  }

  unwrap(): never {
    throw this.value
  }
  expect<R>(err: R): never {
    throw err
  }
  unwrap_or<R>(def: R): R {
    return def
  }
  unwrap_err(): E {
    return this.value
  }

  unwrap_or_else<R>(fn: Fn<E, R>): R {
    return fn(this.value)
  }
  unwrap_or_default<D>(def: Default<D>): never | D {
    return def.default()
  }

  map(_fn: Fn<never, never>): Result<never, E> {
    return this
  }
  map_err<R>(fn: Fn<E, R>): Result<never, R> {
    return Err(fn(this.value))
  }
  and_then<R>(fn: Fn<Result<never, E>, R>): R {
    return fn(this)
  }

  match_ok(_fn: Fn<never, void>): void {}
  match_err(fn: Fn<E, void>): void {
    fn(this.value)
  }
  match(_ok: Fn<never, void>, err: Fn<E, void>): void {
    err(this.value)
  }

  into<R extends ResultIntoFlag>(
    flag: R
  ): R extends 'option' ? Option<never> : R extends 'either' ? Either<never, E> : never {
    if (flag == 'option') return None as any
    else if (flag === 'either') return Right(this.value) as any
    throw new TypeError('not match into')
  }
}

/** ## Err(E) : 表示错误并包含一个错误值 */
export function Err<E>(value: E): Result<never, E> {
  return new err(value)
}

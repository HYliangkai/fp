import {
  AnyError,
  option,
  Left,
  ok_tag,
  empty_tag,
  type Fn,
  type Option,
  type Either,
  type Default,
} from '../../../mod.ts'
import type { Result, ResultIntoFlag } from './interface.ts'

interface Ok<O> extends Result<O, never> {}

class ok<O = void> implements Ok<O> {
  value: O
  _tag: typeof ok_tag
  is_ok: true
  is_err: false
  constructor(val: O) {
    this.value = val
    this._tag = ok_tag
    this.is_ok = true
    this.is_err = false
  }

  unwarp(): O {
    return this.value
  }
  expect<V>(_msg: V): O {
    return this.unwarp()
  }
  unwarp_or<R>(_def: R): O {
    return this.unwarp()
  }
  unwarp_err(): AnyError<'Error'> {
    return AnyError.new('Error', 'Ok value not error', 'ResultError')
  }
  unwrap_or_else<R>(_fn: Fn<never, R>): O {
    return this.value
  }
  unwarp_or_default<D>(def: Default<D>): O | D {
    return this.value
  }

  map<R>(fn: Fn<O, R>): Result<R, never> {
    return Ok(fn(this.value))
  }
  map_err(_fn: Fn<never, never>): Result<O, never> {
    return this
  }
  and_then<R>(fn: Fn<Result<O, never>, R>): R {
    return fn(this)
  }

  match_ok(fn: Fn<O, void>): void {
    fn(this.value)
  }
  match_err(_fn: Fn<never, void>): void {}
  match(ok: Fn<O, void>, _err: Fn<never, void>): void {
    ok(this.value)
  }

  into<R extends ResultIntoFlag>(
    flag: R
  ): R extends 'option' ? Option<O> : R extends 'either' ? Either<O, never> : never {
    if (flag == 'option') return option(this.value) as any
    else if (flag === 'either') return Left(this.value) as any
    throw new TypeError('not match into')
  }
}

/** ## Ok<O> : 表示成功并包含一个值  */
export function Ok<O = void>(value?: O): Result<O, never> {
  arguments.length === 0 ? ((value as any) = empty_tag) : null
  return new ok(value as O)
}

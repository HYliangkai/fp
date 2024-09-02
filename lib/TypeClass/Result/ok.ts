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

export interface Ok<O> extends Result<O, never> {
  readonly _tag: typeof ok_tag
  readonly value: O
}

class ok<O = void> implements Ok<O> {
  readonly value: O
  readonly _tag: typeof ok_tag
  readonly is_ok: true
  readonly is_err: false

  constructor(val: O) {
    this.value = val
    this._tag = ok_tag
    this.is_ok = true
    this.is_err = false
  }

  as<R extends 'boolean'>(flag: R): R extends 'boolean' ? true : never {
    if (flag === 'boolean') return true as any
    throw new TypeError('not match as')
  }

  unwrap(): O {
    return this.value
  }
  expect<V>(_err: V): O {
    return this.unwrap()
  }
  unwrap_or<R>(_def: R): O {
    return this.unwrap()
  }
  unwrap_err(): AnyError<'Error'> {
    return AnyError.new('Error', 'Ok value not error', 'ResultError')
  }
  unwrap_or_else<R>(_fn: Fn<never, R>): O {
    return this.unwrap()
  }
  unwrap_or_default<D>(_def: Default<D>): O | D {
    return this.unwrap()
  }

  map<R>(fn: Fn<O, R>): Result<R, never> {
    return Ok(fn(this.unwrap()))
  }
  map_err(_fn: Fn<never, never>): Result<O, never> {
    return this
  }
  and_then<R>(fn: Fn<Result<O, never>, R>): R {
    return fn(this)
  }

  match_ok(fn: Fn<O, void>): void {
    fn(this.unwrap())
  }
  match_err(_fn: Fn<never, void>): void {}
  match(ok: Fn<O, void>, _err: Fn<never, void>): void {
    ok(this.unwrap())
  }

  into<R extends ResultIntoFlag>(
    flag: R
  ): R extends 'option' ? Option<O> : R extends 'either' ? Either<O, never> : never {
    if (flag == 'option') return option(this.unwrap()) as any
    else if (flag === 'either') return Left(this.unwrap()) as any
    throw new TypeError('not match into')
  }
}

/** ## Ok<O> : 表示成功并包含一个值  */
export function Ok<O = void>(value?: O): Result<O, never> {
  arguments.length === 0 ? ((value as any) = empty_tag) : null
  return new ok(value as O)
}

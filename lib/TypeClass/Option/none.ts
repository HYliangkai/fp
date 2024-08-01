import {
  type Fn,
  type Option,
  type Either,
  type Result,
  type Default,
  type FnReturn,
  Err,
  Right,
  none_tag,
  NoneError,
  implements_default,
  NotImplementsError,
} from '../../../mod.ts'
import type { option } from './interface.ts'

export interface None extends option<never> {
  readonly _tag: typeof none_tag
}

export const None: None = {
  _tag: none_tag,
  is_some: false,
  is_none: true,

  unwarp(): never {
    throw NoneError.new()
  },
  expect(err: unknown): never {
    throw err
  },
  unwrap_or<R>(def: R): R {
    return def
  },
  unwrap_or_else<R>(fn: FnReturn<R>): R {
    return fn()
  },
  unwrap_or_default<R>(value: Default<R>): R {
    if (!implements_default(value)) throw NotImplementsError.new('Default')
    return value.default()
  },

  map<R>(_callback: Fn<never, R>): Option<never> {
    return None
  },
  and_then<R>(callback: Fn<Option<never>, R>): R {
    return callback(None)
  },

  some_do(_fn: Fn<never, unknown>): void {},
  none_do(fn: FnReturn<unknown>): void {
    fn()
  },
  match(_some: Fn<never, unknown>, none: FnReturn<unknown>): void {
    none()
  },

  into<R extends 'result' | 'either'>(
    flag: R
  ): R extends 'result'
    ? Result<never, NoneError>
    : R extends 'either'
    ? Either<never, NoneError>
    : never {
    if (flag === 'either') {
      return Right(NoneError.new()) as any
    } else if (flag === 'result') {
      return Err(NoneError.new()) as any
    } else {
      throw new TypeError('not match into')
    }
  },

  as<R extends 'boolean'>(flag: R): R extends 'boolean' ? boolean : never {
    if (flag === 'boolean') {
      return false as any
    } else {
      throw new TypeError('not match as')
    }
  },
} as const

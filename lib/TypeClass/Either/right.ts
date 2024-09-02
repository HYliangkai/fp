import { AnyError, Err, type Fn, None, type Option, type Result, right_tag } from '@chzky/fp'
import type { Either } from './interface.ts'
import { Left } from './mod.ts'

export interface Right<T> extends Either<never, T> {
  readonly _tag: typeof right_tag
  readonly right: T
}

export class right<T> implements Right<T> {
  readonly _tag: typeof right_tag = right_tag
  readonly right: T
  is_left = false
  is_right = true

  constructor(right: T) {
    this.right = right
  }

  unwrap(): T {
    return this.right
  }
  unwrap_left(): never {
    throw AnyError.new('Error', 'cannot unwrap_left from right', 'EitherError')
  }
  unwrap_right(): T {
    return this.unwrap()
  }
  unwrap_lor<O>(or: O): O {
    return or
  }
  unwrap_ror<O>(_or: O): T {
    return this.unwrap()
  }
  exchange(): Either<T, never> {
    return Left(this.unwrap())
  }
  right_do(callback: (val: T) => void): void {
    callback(this.unwrap())
  }
  left_do: Fn<Fn<never, void>, void> = () => {}
  match(_left: Fn<never, void>, right: Fn<T, void>): void {
    this.right_do(right)
  }

  into<R extends 'option' | 'result'>(
    flag: R
  ): R extends 'option'
    ? Option<never> | Option<R>
    : R extends 'result'
    ? Result<never, R>
    : never {
    if (flag === 'option') return None as any
    if (flag === 'result') return Err(this.unwrap()) as any
    throw new TypeError('not match into')
  }

  as<R extends 'boolean'>(flag: R): R extends 'boolean' ? boolean : never {
    if (typeof flag === 'boolean') return false as any
    throw new TypeError('not match as')
  }
}

export function Right<T>(val: T): Right<T> {
  return new right<T>(val)
}

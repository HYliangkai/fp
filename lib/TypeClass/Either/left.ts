import { AnyError, left_tag, Ok, option, type Fn, type Option, type Result } from '@chzky/fp'
import type { Either } from './interface.ts'
import { Right } from './mod.ts'

export interface Left<T> extends Either<T, never> {
  readonly _tag: typeof left_tag
  readonly left: T
}

export class left<T> implements Left<T> {
  readonly _tag: typeof left_tag = left_tag

  readonly left: T
  is_left = true
  is_right = false

  constructor(left: T) {
    this.left = left
  }

  merge(): T | never {
    return this.left
  }
  unwrap_left(): T {
    return this.merge()
  }
  unwrap_right(): never {
    throw AnyError.new('Error', 'cannot unwrap_right from left', 'EitherError')
  }
  unwrap_lor<O>(_or: O): T | O {
    return this.merge()
  }
  unwrap_ror<O>(or: O): O {
    return or
  }
  exchange(): Either<never, T> {
    return Right(this.left)
  }
  left_do(callback: (val: T) => void): void {
    callback(this.left)
  }
  right_do: Fn<Fn<never, void>, void> = () => {}
  match(left: Fn<T, void>, _right: Fn<never, void>): void {
    this.left_do(left)
  }

  into<R extends 'option' | 'result'>(
    flag: R
  ): R extends 'option' ? Option<T> : R extends 'result' ? Result<T, never> : never {
    if (flag === 'option') return option(this.merge()!) as any
    if (flag === 'result') return Ok(this.left) as any
    throw new TypeError('not match into')
  }

  as<R extends 'boolean'>(flag: R): R extends 'boolean' ? boolean : never {
    if (flag === 'boolean') return true as any
    throw new TypeError('not match as')
  }
}

console.log(new left(1).merge())

export function Left<T>(val: T): Left<T> {
  return new left<T>(val)
}

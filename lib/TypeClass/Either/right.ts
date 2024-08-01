import { AnyError, Err, Fn, None, Option, Result, right_tag } from '../../../mod.ts'
import { Either } from './interface.ts'
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

  merge(): T {
    return this.right
  }
  unwarp_left(): never {
    throw AnyError.new('Error', 'cannot unwarp_left from right', 'EitherError')
  }
  unwarp_right(): T {
    return this.merge()
  }
  unwarp_lor<O>(or: O): O {
    return or
  }
  unwarp_ror<O>(_or: O): T {
    return this.merge()
  }
  exchange(): Either<T, never> {
    return Left(this.merge())
  }
  right_do(callback: (val: T) => void): void {
    callback(this.merge())
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
    if (flag === 'result') return Err(this.merge()) as any
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

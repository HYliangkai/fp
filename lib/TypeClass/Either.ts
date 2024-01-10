import {Err, Ok} from './mod.ts'

export const left_tag = Symbol('left')
export const right_tag = Symbol('right')

interface either<L, R> {
  readonly _tag: typeof left_tag | typeof right_tag
  /** ### is left? */
  is_left: boolean
  /** ### if left , do  */
  left_do: (callback: (val: L) => void) => void
  /** ### is right? */
  is_right: boolean
  /** ### if right , do */
  right_do: (callback: (val: R) => void) => void
  /** ### match left and right in callback  */
  match: (left: (val: L) => void, right: (val: R) => void) => void
  /** ### map left and right in callback */
  map: <E, A>(left: (val: L) => E, right: (val: R) => A) => Either<E, A>
  /** ### get left value or use param value */
  unwarp_left_or: <E>(left: E) => E | L
  /** ### get right value or use param value */
  unwarp_right_or: <A>(right: A) => A | R
  /** ### to result */
  to_result: () => Result<L, R>
  /** ### Either<A,B> -> Either<B,A> */
  exchange: () => Either<R, L>
  /** ### merge data */
  merge: () => L | R
}

interface Left<T> extends either<T, never> {
  readonly _tag: typeof left_tag
  readonly left: T
}

interface Right<T> extends either<never, T> {
  readonly _tag: typeof right_tag
  readonly right: T
}

/** ###  Either :
-- 表示一个二元的类型 , 可以是: true/false,也可以是right/left
  不像 Result/Option 具有明确用途,而是表示一个泛化的二元状态机
*/
export type Either<L, R> = Left<L> | Right<R>
export type AsyncEither<L, R> = Promise<Either<L, R>>

const leftback = <T>(val: T) => {
  throw {tag: left_tag, value: val}
}
const rightback = <T>(val: T) => {
  throw {tag: right_tag, value: val}
}

export const Either = <L, R>(
  callback: (left: (lvalue: L) => L, right: (rvalue: R) => R) => any
): Result<Either<L, R>, unknown> => {
  try {
    callback(leftback<L>, rightback<R>)
    return Err('void callback')
  } catch (err) {
    if (typeof err == 'object' && Object.hasOwn(err, 'tag')) {
      if (err.tag === left_tag) {
        return Ok(Left(err.value) as Either<L, never>)
      } else if (err.tag == right_tag) {
        return Ok(Right(err.value) as Either<never, R>)
      }
    }
    return Err(err)
  }
}
export const BooleanEither = <T>(val: T): Either<T, T> => (val ? Left(val) : Right(val))

export const Left = <L, R = never>(value: L): Either<L, R> => {
  return {
    _tag: left_tag,
    left: value,
    is_left: true,
    is_right: false,
    left_do: cb => {
      cb(value)
    },
    right_do: () => {},
    match: (le, _ri) => {
      le(value)
    },
    map: (le, _ri) => Left(le(value)),
    unwarp_left_or: _val => value,
    unwarp_right_or: val => val,
    to_result: () => Ok(value),
    exchange: () => Right(value),
    merge: () => value,
  }
}

export const Right = <R, L = never>(value: R): Either<L, R> => {
  return {
    _tag: right_tag,
    right: value,
    is_left: false,
    is_right: true,
    left_do: () => {},
    right_do: cb => {
      cb(value)
    },
    match: (_le, ri) => {
      ri(value)
    },
    map: (_le, ri) => Right(ri(value)),
    unwarp_left_or: val => val,
    unwarp_right_or: _val => value,
    to_result: () => Err(value),
    exchange: () => Left(value),
    merge: () => value,
  }
}

import type { Fns } from '@chzky/fp'
import type {
  CurrAuto2,
  CurrAuto2Rev,
  CurrAuto3,
  CurrAuto3Rev,
  CurrAuto4,
  CurrAuto4Rev,
  CurrAuto5,
  CurrAuto5Rev,
  CurrAuto6,
  CurrAuto6Rev,
  CurrAuto7,
  CurrAuto7Rev,
  CurrAuto8,
  CurrAuto8Rev,
} from '../Gymnastics/currauto.type.ts'

/** @curry */
function curr<T, V>(fn: (arg: T) => V): (arg: T) => V
function curr<T, U, V>(fn: (arg: T, arg2: U) => V, level: 2): (arg: T) => (arg2: U) => V
function curr<T, U, V, W>(
  fn: (arg: T, arg2: U, arg3: V) => W,
  level: 3
): (arg: T) => (arg2: U) => (arg3: V) => W
function curr<T, U, V, W, X>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W) => X,
  level: 4
): (arg: T) => (arg2: U) => (arg3: V) => (arg4: W) => X
function curr<T, U, V, W, X, Y>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X) => Y,
  level: 5
): (arg: T) => (arg2: U) => (arg3: V) => (arg4: W) => (arg5: X) => Y
function curr<T, U, V, W, X, Y, Z>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y) => Z,
  level: 6
): (arg: T) => (arg2: U) => (arg3: V) => (arg4: W) => (arg5: X) => (arg6: Y) => Z
function curr<T, U, V, W, X, Y, Z, A>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z) => A,
  level: 7
): (arg: T) => (arg2: U) => (arg3: V) => (arg4: W) => (arg5: X) => (arg6: Y) => (arg7: Z) => A
function curr<T, U, V, W, X, Y, Z, A, B>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z, arg8: A) => B,
  level: 8
): (
  arg: T
) => (arg2: U) => (arg3: V) => (arg4: W) => (arg5: X) => (arg6: Y) => (arg7: Z) => (arg8: A) => B
function curr(fn: Fns<any>, level = 1): any {
  return (arg: any) => {
    if (level === 1) return fn(arg)
    return curr(fn.bind(null, arg), (level - 1) as any)
  }
}

/** @curry_reverse */
function currse<T, V>(fn: (arg: T) => V): (arg: T) => V
function currse<T, U, V>(fn: (arg: T, arg2: U) => V, level: 2): (arg: U) => (arg2: T) => V
function currse<T, U, V, W>(
  fn: (arg: T, arg2: U, arg3: V) => W,
  level: 3
): (arg3: V) => (arg2: U) => (arg: T) => W
function currse<T, U, V, W, X>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W) => X,
  level: 4
): (arg4: W) => (arg3: V) => (arg2: U) => (arg: T) => X
function currse<T, U, V, W, X, Y>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X) => Y,
  level: 5
): (arg5: X) => (arg4: W) => (arg3: V) => (arg2: U) => (arg: T) => Y
function currse<T, U, V, W, X, Y, Z>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y) => Z,
  level: 6
): (arg6: Y) => (arg5: X) => (arg4: W) => (arg3: V) => (arg2: U) => (arg: T) => Z
function currse<T, U, V, W, X, Y, Z, A>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z) => A,
  level: 7
): (arg7: Z) => (arg6: Y) => (arg5: X) => (arg4: W) => (arg3: V) => (arg2: U) => (arg: T) => A
function currse<T, U, V, W, X, Y, Z, A, B>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z, arg8: A) => B,
  level: 8
): (
  arg8: A
) => (arg7: Z) => (arg6: Y) => (arg5: X) => (arg4: W) => (arg3: V) => (arg2: U) => (arg: T) => B
function currse(fn: Fns<any>, level = 1): any {
  function curried(...args: any[]): any {
    if (args.length >= level) return fn(...args.reverse())
    return (new_args: any) => curried(...args, new_args)
  }
  return curried()
}

/** @auto */

function currauto<T, V>(fn: (arg: T) => V): (arg: T) => V
function currauto<T, U, V>(fn: (arg: T, arg2: U) => V, level: 2): CurrAuto2<T, U, V>
function currauto<T, U, V, W>(fn: (arg: T, arg2: U, arg3: V) => W, level: 3): CurrAuto3<T, U, V, W>
function currauto<T, U, V, W, X>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W) => X,
  level: 4
): CurrAuto4<T, U, V, W, X>
function currauto<T, U, V, W, X, Y>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X) => Y,
  level: 5
): CurrAuto5<T, U, V, W, X, Y>
function currauto<T, U, V, W, X, Y, Z>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y) => Z,
  level: 6
): CurrAuto6<T, U, V, W, X, Y, Z>
function currauto<T, U, V, W, X, Y, Z, A>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z) => A,
  level: 7
): CurrAuto7<T, U, V, W, X, Y, Z, A>
function currauto<T, U, V, W, X, Y, Z, A, B>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z, arg8: A) => B,
  level: 8
): CurrAuto8<T, U, V, W, X, Y, Z, A, B>
function currauto(fn: Fns<any>, level = 1): Fns<any> {
  return function curried(...args: any[]): any {
    if (args.length >= level) return fn(...args)
    return (...new_args: any[]) => curried(...args, ...new_args)
  }
}

/** @curry_reverse_auto */
function curr_auto_rev<T, V>(fn: (arg: T) => V): (arg: T) => V
function curr_auto_rev<T, U, V>(fn: (arg: T, arg2: U) => V, level: 2): CurrAuto2Rev<T, U, V>
function curr_auto_rev<T, U, V, W>(
  fn: (arg: T, arg2: U, arg3: V) => W,
  level: 3
): CurrAuto3Rev<T, U, V, W>
function curr_auto_rev<T, U, V, W, X>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W) => X,
  level: 4
): CurrAuto4Rev<T, U, V, W, X>
function curr_auto_rev<T, U, V, W, X, Y>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X) => Y,
  level: 5
): CurrAuto5Rev<T, U, V, W, X, Y>
function curr_auto_rev<T, U, V, W, X, Y, Z>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y) => Z,
  level: 6
): CurrAuto6Rev<T, U, V, W, X, Y, Z>
function curr_auto_rev<T, U, V, W, X, Y, Z, A>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z) => A,
  level: 7
): CurrAuto7Rev<T, U, V, W, X, Y, Z, A>
function curr_auto_rev<T, U, V, W, X, Y, Z, A, B>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z, arg8: A) => B,
  level: 8
): CurrAuto8Rev<T, U, V, W, X, Y, Z, A, B>
function curr_auto_rev(fn: Fns<any>, level = 1): any {
  return function curried(...args: any[]): any {
    if (args.length >= level) return fn(...args.reverse())
    return (...new_args: any) => curried(...args, ...new_args)
  }
}

/** ## `curry` : 函数科里化
@description 将函数的`参数传递`拆分成`多个函数调用`的形式,直到所有参数都传递完毕,才会执行原函数
@example
```ts
  // 一层 Level curry(默认形式)
  const add = (a: number) => (b: number) => a / b
  const add1 = curry(add)(1)
  assertEquals(add1(2), 0.5)
  // 多层 Level curry
  const first = (a: number, a1: number) => (b: number) => (a + a1) / b
  const cr_f = curry(first, 2)(1)(3)
  assertEquals(cr_f(2), 2)
```
@category Function
*/
export const curry = Object.assign(curr, {
  /** ### `reverse` : 参数顺序逆转的科里化函数,参数的调用顺序是从后到前
  @example Usage
  ```ts
  const func = (a: number, b: number, c: number) => [a, b, c]

  const cfn = curry.reverse(func, 3)
  const res = cfn(3)(2)(1)
  assertEquals(res, [1, 2, 3])
  ```
  */
  reverse: currse,

  /** ### `auto` : 自动科里化函数,根据传入的level自动判断科里化的层级
  @example Usage
  ```ts
  const func = (a: number, b: number, c: number) => [a, b, c]

  const cfn = curry.auto(func, 3)
  const remain = cfn(1)(1, 2)

  assertEquals(remain, [1, 1, 2])
  ```
   */
  auto: currauto,

  /** ### `auto_reverse` : 参数顺序逆转的自动科里化函数,参数的调用顺序是从后到前 
  @example Usage
  ```ts
  const func = (a: number, b: number, c: number, d: string) => [a, b, c, d]

  const cfn = curry.auto_reverse(func, 4)
  const remain = cfn('Y')(1, 2)(3)

  assertEquals(remain, [3, 2, 1, 'Y'])
  ```
  */
  auto_reverse: curr_auto_rev,
})

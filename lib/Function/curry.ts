import type { Fns } from '@chzky/fp'

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

/** ## `curry` : 函数科里化
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
})

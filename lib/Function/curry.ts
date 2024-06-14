import { any } from '../Ext/zod.ts'

/** ## curry : 函数科里化
@example
```ts
  // 1Level curry
  const add = (a: number) => (b: number) => a / b
  const add1 = curry(add)(1)
  assertEquals(add1(2), 0.5)
  // 2Level curry
  const first = (a: number, a1: number) => (b: number) => (a + a1) / b
  const cr_f = curry(first, 2)(1)(3)
  assertEquals(cr_f(2), 2)
```
@category Function
*/
export function curry<T, V>(fn: (arg: T) => V): (arg: T) => V
export function curry<T, U, V>(fn: (arg: T, arg2: U) => V, level: 2): (arg: T) => (arg2: U) => V
export function curry<T, U, V, W>(fn: (arg: T, arg2: U, arg3: V) => W, level: 3): (arg: T) => (arg2: U) => (arg3: V) => W
export function curry<T, U, V, W, X>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W) => X,
  level: 4
): (arg: T) => (arg2: U) => (arg3: V) => (arg4: W) => X
export function curry<T, U, V, W, X, Y>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X) => Y,
  level: 5
): (arg: T) => (arg2: U) => (arg3: V) => (arg4: W) => (arg5: X) => Y
export function curry<T, U, V, W, X, Y, Z>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y) => Z,
  level: 6
): (arg: T) => (arg2: U) => (arg3: V) => (arg4: W) => (arg5: X) => (arg6: Y) => Z
export function curry<T, U, V, W, X, Y, Z, A>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z) => A,
  level: 7
): (arg: T) => (arg2: U) => (arg3: V) => (arg4: W) => (arg5: X) => (arg6: Y) => (arg7: Z) => A
export function curry<T, U, V, W, X, Y, Z, A, B>(
  fn: (arg: T, arg2: U, arg3: V, arg4: W, arg5: X, arg6: Y, arg7: Z, arg8: A) => B,
  level: 8
): (arg: T) => (arg2: U) => (arg3: V) => (arg4: W) => (arg5: X) => (arg6: Y) => (arg7: Z) => (arg8: A) => B

export function curry<T>(fn: (...args: unknown[]) => T, level: number): T

export function curry(fn: any, level = 1) {
  return (arg: any) => {
    if (level === 1) return fn(arg)
    return curry(fn.bind(null, arg), level - 1)
  }
}

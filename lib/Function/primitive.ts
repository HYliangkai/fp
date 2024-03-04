/* 提供一系列原语指令 */

import {None, Option, ValueOrFunc, option} from '../../mod.ts'

interface provided {
  <T>(condition: boolean, handle: ValueOrFunc<T>): false | T
  /** ### 将结果转为option : 
  1. 如果condition为true, 则返回Some(handle())
  2. 如果handle()结果为null/underfind, 则返回None
  3. 如果condition为false, 则返回None
  @example
  ```ts
  const r3 = provided.option(judgF, 'R3').unwrap_or('R4')
  const r33 = provided.option(judgF, () => 'R3').unwrap_or('R4')
  assertEquals(r3, 'R4')
  assertEquals(r33, 'R4')

  const r4 = provided.option(judgT, 'R3').unwrap_or('R4')
  const r44 = provided.option(judgT, () => 'R3').unwrap_or('R4')
  assertEquals(r4, 'R3')
  assertEquals(r44, 'R3')
  ```
  */
  option: <T>(condition: boolean, handle: ValueOrFunc<T>) => Option<NonNullable<T>>
}

/**
 * ## provided : 快捷if语句
  用于替代以下效果的if语句:`if () { ... }`
  @example
  ```ts
  const judgT = 'A' == 'A'
  const judgF = 1 + 2 == 2

  const r1 = provided(judgT, 'R1')
  const r11 = provided(judgT, () => 'R1')
  assertEquals(r1, 'R1')
  assertEquals(r11, 'R1')

  const r2 = provided(judgF, 'R2')
  const r22 = provided(judgF, () => 'R2')
  assertEquals(r2, false)
  assertEquals(r22, false)
  ```
  @category Function
 */

export const provided: provided = (<T>(condition: boolean, handle: ValueOrFunc<T>): false | T =>
  condition && (typeof handle === 'function' ? (handle as Function)() : handle)) as any

Object.defineProperty(provided, 'option', {
  enumerable: true,
  writable: false,
  value<T>(condition: boolean, handle: T | (() => T)): Option<NonNullable<T>> {
    return condition ? option(typeof handle === 'function' ? (handle as Function)() : handle) : None
  },
})

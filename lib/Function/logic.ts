/** 快捷的逻辑判断操作 */

import {
  Ok,
  Err,
  None,
  option,
  UnexpectedError,
  type Result,
  type Option,
  type FnReturn,
} from '@chzky/fp'
import { AnyError } from '../mod.ts'

/** ## and : 以函数的形式执行`与`操作
+ 严格只接收`boolean`类型的数据;否则报错
@category logic
*/
export function and(args: boolean[]): boolean
export function and(...args: boolean[]): boolean
export function and(...args: any[]): boolean {
  let target = args
  if (arguments.length === 1 && Array.isArray(arguments[0])) target = arguments[0]

  if (target.some((v) => typeof v !== 'boolean'))
    throw new TypeError('and函数只接收boolean类型的数据')
  return target.every((v) => v === true)
}

/** ## or : 以函数的形式执行`或`操作
+ 严格只接收`boolean`类型的数据;否则报错
@category logic
*/
export function or(args: boolean[]): boolean
export function or(...args: boolean[]): boolean
export function or(...args: any[]): boolean {
  let target = args
  if (arguments.length === 1 && Array.isArray(arguments[0])) target = arguments[0]

  if (target.some((v) => typeof v !== 'boolean'))
    throw new TypeError('or函数只接收boolean类型的数据')
  return target.some((v) => v === true)
}

/** ## if_then : 以函数的形式执行`if`操作
+ 严格只接收`boolean`类型的数据作为判断条件,否则返回`Err`
@example Usage
```ts
const res = if_then(true, () => 1)
assert(res.is_ok)//Pass
assert(res.unwrap().is_some)//Pass
```
@category logic
 */
export function if_then<T>(
  condition: boolean,
  then: FnReturn<T>
): Result<Option<T>, AnyError | TypeError> {
  if (typeof condition !== 'boolean')
    return Err(new TypeError('function if_then only use boolean as arguments '))

  try {
    return Ok(condition ? option(then()) : None)
  } catch (e) {
    if (e instanceof AnyError) return Err(e)
    return UnexpectedError.err(e)
  }
}

/** ## `if_let` : 以函数的形式执行`if let`操作
+ 严格只接收`boolean`类型的数据作为判断条件,否则直接报错
@example Usage
```ts
const res = if_let(true, 1)
assert(res.is_some)//Pass
assert(res.unwrap() === 1)//Pass
```
@category logic
 */
export function if_let<T>(ef: boolean, lat: T): Option<T> {
  if (typeof ef !== 'boolean')
    throw new TypeError('function if_then only use boolean as arguments ')
  return ef ? option(lat) : None
}

/** ## `not` : 以函数的形式执行`非`操作
+ 值等于执行`!value`的结果
@example Usage
```ts
const val = false
assert(not(valu) === !val)
```
@category logic
  */
export function not(value: unknown): unknown {
  return !value
}

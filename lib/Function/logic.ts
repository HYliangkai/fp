/** 快捷的逻辑判断操作 */

import { Err, Ok, Option, None, option, FnReturn, UnexpectedError, type Result } from '@chzky/fp'

/** ## and : 以函数的形式执行`与`操作
+ 严格只接收`boolean`类型的数据;否则返回`Err` */
export function and(args: boolean[]): Result<boolean, TypeError>
export function and(...args: boolean[]): Result<boolean, TypeError>
export function and(...args: any[]): Result<boolean, TypeError> {
  let target = args
  if (arguments.length === 1 && Array.isArray(arguments[0])) target = arguments[0]

  return target.every((v) => typeof v === 'boolean')
    ? Ok(target.every((v) => v === true))
    : Err(new TypeError('and函数只接收boolean类型的数据'))
}

/** ## or : 以函数的形式执行`或`操作
+ 严格只接收`boolean`类型的数据;否则返回`Err` */
export function or(args: boolean[]): Result<boolean, TypeError>
export function or(...args: boolean[]): Result<boolean, TypeError>
export function or(...args: any[]): Result<boolean, TypeError> {
  let target = args
  if (arguments.length === 1 && Array.isArray(arguments[0])) target = arguments[0]
  return target.every((v) => typeof v === 'boolean')
    ? Ok(target.some((v) => v === true))
    : Err(new TypeError('or函数只接收boolean类型的数据'))
}

/** ## if_then : 以函数的形式执行`if`操作
+ 严格只接收`boolean`类型的数据作为判断条件,否则返回`Err` */
export function if_then<T>(
  condition: boolean,
  then: FnReturn<T>
): Result<Option<T>, UnexpectedError | TypeError> {
  if (typeof condition !== 'boolean')
    return Err(new TypeError('function if_then only use boolean as arguments '))

  try {
    return Ok(condition ? option(then()) : None)
  } catch (e) {
    return UnexpectedError.err(e)
  }
}

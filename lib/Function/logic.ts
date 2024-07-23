/** 快捷的逻辑判断操作 */

import { Err, Ok, type Result } from '../../mod.ts'

/** ## and : 与操作,严格只接收boolean类型的数据;否则返回Err */
export function and(args: boolean[]): Result<boolean, TypeError>
export function and(...args: boolean[]): Result<boolean, TypeError>
export function and(...args: any[]): Result<boolean, TypeError> {
  let target = args
  if (arguments.length === 1 && Array.isArray(arguments[0])) target = arguments[0]

  return target.every((v) => typeof v === 'boolean')
    ? Ok(target.every((v) => v === true))
    : Err(new TypeError('and函数只接收boolean类型的数据'))
}

/** ## or : 或操作,严格只接收boolean类型的数据;否则返回Err */
export function or(args: boolean[]): Result<boolean, TypeError>
export function or(...args: boolean[]): Result<boolean, TypeError>
export function or(...args: any[]): Result<boolean, TypeError> {
  let target = args
  if (arguments.length === 1 && Array.isArray(arguments[0])) target = arguments[0]
  return target.every((v) => typeof v === 'boolean')
    ? Ok(target.some((v) => v === true))
    : Err(new TypeError('or函数只接收boolean类型的数据'))
}

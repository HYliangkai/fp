/** 快捷的逻辑判断操作 */

import {Err, Ok, Result} from '../../mod.ts'

/** ## and : 与操作,严格只接收boolean类型的数据;否则返回Err */
export function and(...args: boolean[]): Result<boolean, TypeError> {
  return args.every(v => typeof v === 'boolean')
    ? Ok(args.every(v => v === true))
    : Err(new TypeError('and函数只接收boolean类型的数据'))
}

/** ## or : 或操作,严格只接收boolean类型的数据;否则返回Err */
export function or(...args: boolean[]): Result<boolean, TypeError> {
  return args.every(v => typeof v === 'boolean')
    ? Ok(args.some(v => v === true))
    : Err(new TypeError('or函数只接收boolean类型的数据'))
}

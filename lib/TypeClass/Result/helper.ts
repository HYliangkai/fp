import {
  Ok,
  Err,
  is_err,
  BackTrack,
  NoneError,
  UnexpectedError,
  type Option,
  type Result,
  type AsyncResult,
} from '@chzky/fp'
import type { ResultConstructor } from './interface.ts'

function _result<T, E = unknown>(fn: () => T): Result<T, E> {
  try {
    const res = fn()
    return Ok(res)
  } catch (err: any) {
    return err instanceof BackTrack ? Ok(err.return_val) : is_err(err) ? err : Err(err)
  }
}

async function _async_result<T, E = unknown>(fn: () => Promise<T>): AsyncResult<T, E> {
  try {
    const res = await fn()
    return Ok(res)
  } catch (err: any) {
    return err instanceof BackTrack ? Ok(err.return_val) : is_err(err) ? err : Err(err)
  }
}

function _from<T>(val: Option<T>): Result<T, NoneError> {
  if (val.is_none) return Err(NoneError.new())
  if (val.is_some) return Ok(val.unwrap())
  throw UnexpectedError.new('Option is not Some or None')
}

function _produce<O, E = unknown, P = unknown>(
  fn: (...args: P[]) => O
): (...args: P[]) => Result<O, E> {
  return (...args) => _result(() => fn(...args))
}

function _wait_for<O, E = unknown, P = unknown>(
  fn: (...args: P[]) => Promise<O>
): (...args: P[]) => AsyncResult<O, E> {
  return (...args) => _async_result(() => fn(...args))
}

/** ## `result` : 从函数中生成`Result`类型数据
@description 将一个可能throw的普通语句/代码/函数 转化为Result<(return value),(throw value)>类型
 */
export const result = Object.assign(_result, {
  async: _async_result,

  produce: _produce,

  wait_for: _wait_for,

  /** ### from` : 从`Option`转化成`Result` */
  from: _from,
}) as ResultConstructor

/**  ## async_result : {@link result}的异步版本
  @deprecated 使用`result()`or`result.async()`替代
  @description
    将一个可能throw的普通`异步` 语句/代码/函数 转化为Result<(return value),(throw value)>类型  
  @example
  ```ts
  const res = result(() => {
    if (Math.random() > 0.5) {
      return 1
    } else {
      throw new Error('test error')
    }
  })
  res.match_ok(val => {
    console.log(val) // 1
  })
  ```
  @category TypeClass
 */
export const async_result = _async_result

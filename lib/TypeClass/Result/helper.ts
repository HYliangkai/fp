import { BackTrack, Err, Ok, type Result, type AsyncResult } from './mod.ts'

interface result {
  /** ## result : 将一个可能throw的 `同步` 语句/代码/函数 转化为Result<(return value),(throw value)>类型数据
  @todo result支持同步调用和异步调用
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
  <T, E = unknown>(fn: () => T): Result<T, E>
  /** ## result.async : {@link result}的异步版本

  @description
    将一个可能throw的普通`异步` 语句/代码/函数 转化为Result<(return value),(throw value)>类型  @deprecated 使用`result()`or`result.async()`替代
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
  async<T, E = unknown>(fn: () => Promise<T>): AsyncResult<T, E>
}

function _result<T, E = unknown>(fn: () => T): Result<T, E> {
  try {
    const res = fn()
    return Ok(res)
  } catch (err: any) {
    return err instanceof BackTrack ? Ok(err.return_val) : Err(err)
  }
}

async function _async_result<T, E = unknown>(fn: () => Promise<T>): AsyncResult<T, E> {
  try {
    const res = await fn()
    return Ok(res)
  } catch (err: any) {
    return err instanceof BackTrack ? Ok(err.return_val) : Err(err)
  }
}

export const result = Object.assign(_result, { async: _async_result }) as result

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

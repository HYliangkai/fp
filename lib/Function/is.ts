import { type Fns, type Result, error_tag, ok_tag, zod } from '../../mod.ts'
/** ## is_async_func : 运行时判断函是否是 async函数
@tips 只能判断
      1. 一个函数是否带`async`关键字，不能判断函数是否返回Promise(函数返回只能在运行时判断) 
@example
```ts
  const sync = (x: number) => x + 1
  const asyncfn = async (x: number) =>
    new Promise(res => {
      setTimeout(() => {
        res(x + 1)
      }, 1000)
    })
  assertEquals(is_async_func(asyncfn), true)
  assertEquals(is_async_func(sync), false)
```
@catrgory Function
  */
export const is_async_func = (fn: Fns<any>): fn is () => Promise<unknown> => {
  if (typeof fn !== 'function') return false
  if (fn.constructor && fn.constructor.name === 'AsyncFunction') return true
  return false
}

/** ## is_number : 运行时判断数据是否是数字 
+ 包含两种情况判断为数字 :
  1. 数字 : 1,2,3,4,5... <包括Infinity,-Infinity;不包括NaN>
  2. 能转为数字的字符串: '1.1','2','114514'...

  @category Function
 */
export const is_number = (val: unknown): boolean =>
  (typeof val === 'string' || typeof val === 'number') &&
  zod.number().safeParse(Number(val)).success

/** ## is_result : 运行时判断是否Result类型 
  @example
  ```ts
  const res = result(() => {
    if (Math.random() > 0.5) {
      return 1
    } else {
      throw new Error('test error')
    }
  })
  console.log(is_result(res)) // true
  ```
  @category Function
*/
export function is_result<T = unknown, E = unknown>(val: { _tag?: any }): val is Result<T, E> {
  return val._tag === ok_tag || val._tag === error_tag
}

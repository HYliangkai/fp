import {Async_Tag} from '../mod.ts'
/** ## is_async_func : 运行时判断函是否是 async函数
@tips 只能判断一个函数是否带`async`关键字，不能判断函数是否返回Promise(只能在运行时判断)
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
export const is_async_func = (fn: Function): fn is () => Promise<unknown> => {
  if (typeof fn !== 'function') return false
  if (fn.constructor && fn.constructor.name === 'AsyncFunction') return true
  if ((fn as any).fntag === Async_Tag) return true
  return false
}

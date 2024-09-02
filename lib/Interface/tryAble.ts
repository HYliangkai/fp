import type { Fns, Result } from '@chzky/fp'

/** ## TryAble : 表示函数调用可能会失败的情况,返回值为`Result<O,E>`
这是一种函数命名的约定俗成.如果你在函数名前加上`try_`前缀,第一反应应该是这个函数可能会失败,返回值为`Result<O,E>`
@example Usage : 使用`TryAble`约定来表示函数调用可能会失败的情况
```ts
interface Demo extends TryAble<'done'> {
  // override func sign
  try_done: Fns<Result<number, string>>
}
const demo: Demo = {
  try_done: function (...args: any[]): Result<number, string> {
    return Ok(1)
  },
}
```
@category Interface
*/
export type TryAble<FuncNames extends string> = {
  [K in `try_${FuncNames}`]: Fns<Result<unknown, unknown>>
}

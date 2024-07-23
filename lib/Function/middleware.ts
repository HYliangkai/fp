import type { Fn, MiddleWare } from '../../mod.ts'

/** ## middleware : 中间件函数
用于将函数进行结果转换:
+ 如果执行函数没有返回值(或者返回值为`underfind`),则返回传入的值
+ 如果存在返回值,则返回函数的返回值
@example
```ts
// 1.  console.log打log , 对代码不进行侵入式修改
const res = pipe(
      'hello',
      middleware(console.log),
      (v)=>v+' world' )
assertEquals(res,'hello world')

// 2. 替代map
const res = [1,2,3].map(middleware((v)=>v*2))
assertEquals(res,[2,4,6])
```
@version 0.8.0
@category Function
 */
export const middleware: MiddleWare = function <V, T = void>(
  val: Fn<V, T>
): Fn<V, T extends void ? V : T> {
  return ((data: V) => {
    const res = val(data)
    return res === undefined ? data : res
  }) as Fn<any, any>
}

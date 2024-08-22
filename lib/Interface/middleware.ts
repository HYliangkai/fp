import type { Fn } from '@chzky/fp'

/** ## MiddleWare : 实现了中间件功能的函数
### 该接口的特性定义为:
1. 如果执行函数没有返回值(或值为`underfind`),则返回传入的值
2. 如果存在返回值,则返回执行函数的返回值
@category Interface
 */
export interface MiddleWare {
  <T, R = void>(callback: Fn<T, R>): Fn<T, R extends void ? T : R>
}

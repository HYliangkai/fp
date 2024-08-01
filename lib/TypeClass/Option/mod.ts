import { None } from './none.ts'
import { Some } from './some.ts'
import { option } from './helper.ts'

/** ## Option : 表示一个可选值,每个`Option`要么是`Some`并且包含一个值，要么是`None`并且不包含值。   
option 用于解决js中null和undefined概念不清晰的问题,使用Option可以`明确的表示一个值是否存在`,如果不存在就返回None,存在就返回Some(val);此外,option还有其他用途:
+ 用于初始化值
+ 用于表示可选的参数
 */
type Option<T> = Some<NonNullable<T>> | None

type AsyncOption<T> = Promise<Option<T>>

export { Some, None, type Option, type AsyncOption, option }

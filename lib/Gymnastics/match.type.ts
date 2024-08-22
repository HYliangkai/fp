import type { Equal, Fn } from '@chzky/fp'

export type EqualInfer<T> = T extends Equal<infer U> ? U | T : T

/** ## JudeCondition<T> : 判断条件
@example
  ```ts
  const judgT : JudeCondition<number> = val => val == 1
  const judgF : JudeCondition<number> = val => val == 2
  ```
@category Gymnastics
*/
export type JudeCondition<T> = Fn<T, boolean>

/** ## Condition<T> -  能够进行 match 的 条件
+ 同类型数据`T`,用于全等比较
+ 函数的返回值为`boolean`
+ 实现了`PartialEq`的数据结构
+ 实现了`Equal`的数据结构
@category Gymnastics
*/
export type Condition<T> = EqualInfer<T> | JudeCondition<EqualInfer<T>>

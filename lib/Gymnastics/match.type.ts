import type { Equal, Fn } from '../../mod.ts'

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

/** ## Condition<T> : match 的 条件
@example
  ```ts
  const judgTT : JudeCondition<number> = val => val == 1
  const judgT : Condition<number> = val => Date.now() % 2 == 0 ? judgTT ? 1
  ```
@category Gymnastics
*/
export type Condition<T> = EqualInfer<T> | JudeCondition<EqualInfer<T>>

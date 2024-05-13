/** ## FnReturn 
  参数为空,返回值为`T`的函数
  @category Gymnastics
*/
export type FnReturn<T> = () => T

/** ## Fn<T,R>
  参数为单个的`T`,返回值为`R`的函数
  @category Gymnastics
 */
export type Fn<T, R> = (val: T) => R

/** ## ValueOrFunc<T> : 可能是T也可能是返回值为T的函数
@example
  ```ts
  const a = 1
  const b = () => 2
  const Val : ValueOrFunc<number> = Date.now() % 2 == 0 ? a : b 
  ```
@category Gymnastics
*/
export type ValueOrFunc<T> = T | (() => T)

/** ## JudeCondition<T> : 判断条件
@example
  ```ts
  const judgT : JudeCondition<number> = val => val == 1
  const judgF : JudeCondition<number> = val => val == 2
  ```
@category Gymnastics
*/
export type JudeCondition<T> = (val: T) => boolean

/** ## Condition<T> : 条件
@example
  ```ts
  const judgTT : JudeCondition<number> = val => val == 1
  const judgT : Condition<number> = val => Date.now() % 2 == 0 ? judgTT ? 1
  ```
@category Gymnastics
*/
export type Condition<T> = T | JudeCondition<T>

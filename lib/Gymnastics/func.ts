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

/** ## Fns<T>
  参数为任意个,返回值为`T`的函数
 */
export type Fns<T> = (...args: any[]) => T

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

/** ## AnyFunc
  可表示为任意函数
  @category Gymnastics
 */
export type AnyFunc = (...args: any[]) => any

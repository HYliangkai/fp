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

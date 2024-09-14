/** ## `EmptyObject` : 空对象
@category Gymnastics
*/
export type EmptyObject = Record<string | number | symbol, never>

/** ## `Constructor<T>` : `class`类型
@category Gymnastics
*/
export type Constructor<T> = new (...args: any[]) => T

/** ## `UnionInclude` : 联合包含类型
@description 联合类型`T`中必须包含`I`类型,否则返回`never`类型
@category Gymnastics
 */
export type UnionInclude<T, I> = T extends I ? T : never

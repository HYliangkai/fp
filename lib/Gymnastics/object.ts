/** ## `EmptyObject` : 空对象
@category Gymnastics
*/
export type EmptyObject = Record<string | number | symbol, never>

/** ## `Constructor<T>` : `class`类型
@category Gymnastics
*/
export type Constructor<T> = new (...args: any[]) => T

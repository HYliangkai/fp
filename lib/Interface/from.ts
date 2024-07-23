/** ## From : 类型转化接口 
@description A.from(B) == B.into(A)
@example
```ts

```
@todo : from和into的文档
@category Interface
 */
export interface From<T> {
  readonly from: (val: T) => From<T>
}

/** ## Into : 类型转化接口 , from的反向操作 
@description B.into(A) == A.from(B)
@example
```ts
```
@category Interface
 */
export interface Into<T, F = never> {
  /**
   * @param flag 运行时判断不同类型的标志
   */
  readonly into: F extends never ? () => T : (flag: F) => T
}

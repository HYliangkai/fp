/** ## TypeLiteral 获取基础类型字面量
@example
```ts
type array_obj = TypeLiteral<string[] | {name: 'jiojio'}> // 'array' | 'object'
type num = TypeLiteral<1 | 2 | 3> // '1' | '2' | '3'
type 
```
@category Gymnastics
 */
export type TypeLiteral<T> = LiteralInfer<T> extends never ? 'object' : LiteralInfer<T>
type LiteralInfer<T> = T extends string
  ? `${T}`
  : T extends number
  ? `${T}`
  : T extends boolean
  ? `${T}`
  : T extends null
  ? 'null'
  : T extends undefined
  ? 'undefined'
  : T extends symbol
  ? 'symbol'
  : T extends bigint
  ? `${T}`
  : T extends Function
  ? 'function'
  : T extends Array<any>
  ? 'array'
  : never

/** ## NaN : NaN的类型表示方法,虽然可以是任意数字类型
@category Gymnastics
*/
export type NaN = number

/** ## Refer : 将任意数据转换为Refer类型数据,值存储在value中
@category Gymnastics
*/
export type Refer<T> = { value: T }
/** ## refer : 将数据转换为ref类型数据的函数
@category Gymnastics
 */
export function refer<T>(input: T): Refer<T> {
  return { value: input }
}

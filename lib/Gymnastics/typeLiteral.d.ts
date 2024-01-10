/** ## TypeLiteral 获取基础类型字面量
@example
```ts
type array_obj = TypeLiteral<string[] | {name: 'jiojio'}> // 'array' | 'object'
type num = TypeLiteral<1 | 2 | 3> // '1' | '2' | '3'
type 
```
@category Gymnastics
 */
declare type TypeLiteral<T> = LiteralInfer<T> extends never ? 'object' : LiteralInfer<T>
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

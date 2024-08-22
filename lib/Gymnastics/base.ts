import type { AnyFunc } from '@chzky/fp'

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
  : T extends AnyFunc
  ? 'function'
  : T extends Array<any>
  ? 'array'
  : never

/** ## NaN : NaN的类型表示方法,虽然可以是任意数字类型
@category Gymnastics
*/
export type NaN = number

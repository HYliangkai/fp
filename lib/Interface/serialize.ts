import { type Result, zod } from '@chzky/fp'

/** ## Serialize : 序列化
@explain 正反序列化恒等性 : `Serialize<A, B> ==  `{@link DeSerialize}`<B, A>`
@example
```ts
const can_serialize: Serialize<object, string> & DeSerialize<string, object> = {
  serialize: function (data: object): string {
    return JSON.stringify(data)
  },
  deserialize: function (data: string): object {
    return JSON.parse(data)
  },
}
// case : Serialize<object, string> == DeSerialize<string, object>
```
@catrgory Interface
*/
export interface Serialize<A, B> {
  readonly serialize: (data: A) => B
  readonly deserialize: (data: B) => A
}

/** ## DeSerialize : 反序列化 
@explain 正反序列化恒等性 : {@link Serialize}`<A, B> == DeSerialize<B, A>`
@example
```ts
const can_serialize: DeSerialize<string, object> & Serialize<object, string> = {
  serialize: function (data: object): string {
    return JSON.stringify(data)
  },
  deserialize: function (data: string): object {
    return JSON.parse(data)
  },
}
// case : DeSerialize<string, object> == Serialize<object, string> 
```
@catrgory Interface
*/
export interface DeSerialize<B, A> {
  readonly deserialize: (data: B) => A
  readonly serialize: (data: A) => B
}

/** ## MaybeSerialize : 可能会失败的序列化
@catrgory Interface
  */
export interface MaybeSerialize<A, B, E> {
  readonly serialize: (data: A) => Result<B, E>
  readonly deserialize: (data: B) => Result<A, E>
}

/** ##MaybeSerialize : 可能会失败的反序列化
@catrgory Interface
  */
export interface MaybeDeSerialize<B, A, E> {
  readonly deserialize: (data: B) => Result<A, E>
  readonly serialize: (data: A) => Result<B, E>
}

/** ## `implements_serialize` : duck type to judge Serialize type @category Interface */
export function implements_serialize<A, B>(value: unknown): value is Serialize<A, B> {
  return zod.object({ serialize: zod.function(), deserialize: zod.function() }).safeParse(value)
    .success
}

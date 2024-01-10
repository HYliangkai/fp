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
  serialize(data: A): B
  deserialize(data: B): A
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
  deserialize(data: B): A
  serialize(data: A): B
}

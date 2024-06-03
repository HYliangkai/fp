/**  ## PartialEq : 提供一个`同类型`数据相等性判断的功能
@example 
```ts
class User implements PartialEq {
  constructor(public name: string, public age: number) {}
  eq(other: this) {return other.name == this.name && other.age == this.age}
}
  const User1 = new User('Tom', 18)
  const User2 = new User('dio', 18)
  const User3 = new User('Tom', 18)

  assertFalse(User1.eq(User2))//Pass
  assert(User1.eq(User3))//Pass

```
@category Interface
*/

export interface PartialEq {
  readonly eq: (other: this) => boolean
}

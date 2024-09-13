/** ## `Refer` : 将数据变为`内部可变`数据
1.表示一个可变的数据结构,用在数据需要变化的场景  
2.在Immut中作为不可变数据的可变部分
@example Usage
```ts
const refer = Refer(1)
refer.update(2)
assert(refer.value === 2)
```
@category TypeClass
*/
export interface Refer<T> {
  readonly value: T

  /** `### update` : 更新value数据 */
  update: (value: T) => void
}

export class refer<T> implements Refer<T> {
  constructor(public value: T) {}

  update(value: T): void {
    this.value = value
  }
}

export function Refer<T>(value: T): Refer<T> {
  return new refer<T>(value)
}

export function is_refer(val: unknown): val is Refer<any> {
  return val instanceof refer
}

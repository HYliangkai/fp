/** ## `Refer` : 将数据变为`可变`数据
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

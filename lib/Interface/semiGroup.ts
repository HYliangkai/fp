/** ## [SemiGroup<半群>](https://www.jdon.com/designpatterns/functional-patterns-semigroup.html) : 提供数据合并的功能
@example
```ts
const SemiGroup = {
  concat: (semi_l: string, semi_r: string) => semi_l + semi_r
}
assert(SemiGroup.concat('a', 'b') === 'ab')
```
@category Interface
 */
export interface SemiGroup<T> {
  readonly concat: (semi_l: T, semi_r: T) => T
}

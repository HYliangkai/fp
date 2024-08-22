import { zod } from '@chzky/fp'

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

/** ## `implements_semi_group` : duck type to judge SemiGroup type  @category Interface */
export function implements_semi_group<T = unknown>(value: unknown): value is SemiGroup<T> {
  return zod.object({ concat: zod.function() }).safeParse(value).success
}

import { zod } from '@chzky/fp'
/** ## Eq : 提供一个`不同类型`数据相等性判断的功能
@example
  ```ts
  class A implements Eq<number> {
    constructor(public a?: number) {}

    equals(val: number): boolean {
      return this.a === val
    }
  }
  const Na = new A(1)
  assert(Na.equals(1) === true)
  assert(Na.equals(2) === false)
  ```
@category Interface
 */

export interface Equal<A> {
  readonly equals: (val: A) => boolean
}

/** ## `implements_equal` : duck type to judge Equal type 
  @category Interface
*/
export function implements_equal(value: unknown): value is Equal<unknown> {
  return zod.object({ equals: zod.function() }).safeParse(value).success
}

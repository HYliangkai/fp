import {Equal} from './mod.ts'

/** ## OrdResult : 比较结果
@case -1 小于
@case 0 等于
@case 1 大于
@category Interface
 */
type OrdResult = -1 | 0 | 1

/** ## Ord : 提供排序比较的功能
@example
```ts
class A implements Ord<number> {
  constructor(public a?: number) {}

  equals(val: number): boolean {
    return this.a === val
  }
  compare(val: number): number {
    return this.a - val
  }
}
const Na = new A(1)
assert(Na.equals(1) === true)
assert(Na.equals(2) === false)
assert(Na.compare(2) === -1)
assert(Na.compare(1) === 0)
assert(Na.compare(0) === 1)
```
@category Interface

 */
export interface Ord<T> extends Equal<T> {
  compare(val: T): OrdResult
}

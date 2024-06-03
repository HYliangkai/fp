import {Equal} from './mod.ts'

/** ## OrdResult : 两个数据的比较结果
@case LT = -1 小于
@case EQ =  0 等于
@case GT =  1 大于
@category Interface
 */
export enum OrdResult {
  LT = -1,
  EQ = 0,
  GT = 1,
}

/** ## Ord : 提供比较的功能
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
  readonly compare: (val: T) => OrdResult
}

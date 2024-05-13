/** ## Eq : 提供一个不同类型数据相等性判断的功能
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
  equals(val: A): boolean
}

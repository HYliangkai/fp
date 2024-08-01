/** ## From : 类型转化接口 
From 和 Into 表示可以相互转化的两个类型,两者是对称的关系
@description A.from(B) == B.into(A)
@example
```ts
  class A implements From<B> {
    constructor(public a?: number) {}

    from(val: B) {
      return new A(val.a)
    }
  }

  class B implements Into<A, unknown> {
    constructor(public a?: number) {}

    into(flag?: unknown): A {
      return new A(this.a)
    }
  }
  const Na = new A()
  const Nb = new B(12)

  assert(Na.from(new B(1)).a === 1)
  assert(Na.from(new B(1)) instanceof A)

  assert(Nb.into().a === 12)
  assert(Nb.into() instanceof A)
```
@category Interface
 */
export interface From<T> {
  readonly from: (val: T) => From<T>
}

/** ## Into : 类型转化接口 , from的反向操作  
@description B.into(A) == A.from(B)
@example
```ts
  class A implements From<B> {
    constructor(public a?: number) {}

    from(val: B) {
      return new A(val.a)
    }
  }

  class B implements Into<A, unknown> {
    constructor(public a?: number) {}

    into(flag?: unknown): A {
      return new A(this.a)
    }
  }
  const Na = new A()
  const Nb = new B(12)

  assert(Na.from(new B(1)).a === 1)
  assert(Na.from(new B(1)) instanceof A)

  assert(Nb.into().a === 12)
  assert(Nb.into() instanceof A)
```
@category Interface
 */
export interface Into<T extends From<any>, F = never> {
  /**
   * @param flag 运行时判断不同类型的标志
   */
  readonly into: F extends never ? () => T : (flag: F) => T
}

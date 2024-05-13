/** ## From : 类型转化接口 
@description A.from(B) == B.into(A)
@example
```ts
  class A implements From<B> {
    constructor(public a?: number) {}

    from(val: B): this {
      return new A(val.a) as this
    }
  }

  class B implements InTo<A> {
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
  readonly from: (val: T) => this
}

/** ## InTo : 类型转化接口 , from的反向操作
@description B.into(A) == A.from(B)
@example
```ts
  class A implements From<B> {
    constructor(public a?: number) {}

    from(val: B): this {
      return new A(val.a) as this
    }
  }

  class B implements InTo<A> {
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
export interface InTo<T> {
  readonly into: (flag?: unknown) => T
}

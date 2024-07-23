import { assert } from '@std/assert/mod.ts'
import { From, Into } from 'lib'

Deno.test('base-from', () => {
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
})

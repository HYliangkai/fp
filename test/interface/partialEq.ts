import {assertFalse} from '@std/assert/assert_false.ts'
import {assert} from '@std/assert/assert.ts'
import {PartialEq} from 'lib'

class User implements PartialEq {
  constructor(public name: string, public age: number) {}

  eq(other: this) {
    return other.name == this.name && other.age == this.age
  }
}

Deno.test('PartialEq', () => {
  const User1 = new User('Tom', 18)
  const User2 = new User('dio', 18)
  assertFalse(User1.eq(User2))

  const User3 = new User('Tom', 18)
  assert(User1.eq(User3))
})

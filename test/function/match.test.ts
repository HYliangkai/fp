import { assert } from '@std/assert/mod.ts'
import { $0, Equal, functor, match, PartialEq, zod } from 'lib'

Deno.test('matcher-test', () => {
  const match_value = { name: 'jiojio', age: 18 }

  assert(match(match_value).done().is_none)

  assert(
    match(match_value)
      .case(functor`${$0.name}==='jiojio'`, 'dio')
      .done()
      .unwrap_or('jiojio') === 'dio'
  )

  class Typer implements PartialEq {
    constructor(public name: string) {}
    eq(other: this) {
      return this.name === other.name
    }
  }
  const result = match(new Typer('jiojio'))
    .case(new Typer('dio'), false)
    .case(new Typer('jiojio'), true)
    .case(new Typer('jio - jio'), false)
    .done()
    .expect('test-error')
  assert(result)

  class Typer2 implements Equal<string> {
    constructor(public name: string) {}
    equals(val: string): boolean {
      return val === this.name
    }
  }

  assert(
    match(new Typer2('jiojio'))
      .case('dio', false)
      .case('jiojio', true)
      .case('123', false)
      .done()
      .unwarp()
  )

  assert(match(new Typer2('jiojio')).case('dio', false).case('123', false).done(true))
})

Deno.test('matcher-test-2', () => {
  //配合zod进行类型匹配

  const pattern1 = zod.number().min(0).max(10)
  const pattern2 = zod.number().min(-10).max(-2)

  const res = match(10)
    .some([zod.validate(pattern1), zod.validate(pattern2)], true)
    .done(false)

  assert(res)
})

Deno.test('matcher-test-when', () => {
  const result = match('JioJio')
    .case('dio', false)
    .when('diojio', functor<boolean>`false`)
    .when('JioJio', () => true)
    .done()
    .unwarp()
  assert(result)
})

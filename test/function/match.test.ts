import { assert, assertEquals, assertThrows } from '@std/assert/mod.ts'
import { $0, Equal, functor, match, PartialEq, zod, Some, reversal, Copy } from '@chzky/fp'

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
      .unwrap()
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

  const pattern3 = zod.option(pattern1)
  match(Some(3)).case(zod.validate(pattern3), true).done(false)
})

Deno.test('matcher-test-when', () => {
  const result = match('JioJio')
    .case('dio', false)
    .when('diojio', functor<boolean>`false`)
    .when('JioJio', () => true)
    .done()
    .unwrap()
  assert(result)
})

Deno.test('matcher-test-every', () => {
  assertThrows(() => {
    //@ts-ignore
    match('jiojio').some([], false)
  })
  assertThrows(() => {
    //@ts-ignore : every必须传入一个有内容的数组,否则会报错
    match('jiojio').every([], true)
  })

  const res = match('jiojio')
    .every(
      [
        reversal<String, 'startsWith'>('startsWith', 'jio'),
        reversal<String, 'endsWith'>('endsWith', 'dio'),
      ],
      'jiodio'
    )
    .every(
      [
        reversal<String, 'startsWith'>('startsWith', 'jio'),
        reversal<String, 'endsWith'>('endsWith', 'jio'),
      ],
      'jiojio'
    )
    .done()
    .unwrap()

  assertEquals(res, 'jiojio')
})

Deno.test('matcher-test-copy', () => {
  const cola = match('jiojio').case('dio', 'isdio')

  // New Matcher
  const colb = cola.clone().case('jiojio', 'isjiojio').done().unwrap()
  assert(colb === 'isjiojio')

  // Original Matcher
  assert(cola.done().unwrap_or(true))
})

Deno.test('matcher-test-rematch', () => {
  const match_str = 'jiojio-dio-is-a-dog'

  //functional expression
  const resfp = match(match_str)
    .when(
      (v) => v.startsWith('jiojio'),
      (v) => v?.replace('jiojio', '')
    )
    .when(
      (v) => v.startsWith('dio'),
      (v) => v?.replace('dio', '')
    )
    .rematch() // 结果进行重新匹配
    .when(reversal('as', 'boolean'), (v) => v?.unwrap().replace('-dio-is-a-', ''))
    .done()
    .unwrap()

  // procedural
  let respd = ''
  if (match_str.startsWith('jiojio')) {
    respd = match_str.replace('jiojio', '')
  } else if (match_str.startsWith('dio')) {
    respd = match_str.replace('dio', '')
  }
  if (respd !== '') {
    respd = respd.replace('-dio-is-a-', '')
  }

  assertEquals(resfp, respd)
})

import { assertEquals } from '@std/assert/mod.ts'
import { $0, $1, Proxy_Value, functor, pipe } from '@chzky/fp'
Deno.test('test-functor', () => {
  const Arr = [1, 2, 3, 4]
  const val = 1
  const res = Arr.map(functor<number>`$0+${val}`)
  assertEquals(res, [2, 3, 4, 5])
})

Deno.test('test-functor-2', () => {
  const res = pipe(1, functor`$0*2`, functor`{name:'jiojio',age:$0}`, functor`{ result: $0 }`)
  assertEquals(res, { result: { name: 'jiojio', age: 2 } })
})

Deno.test('test-functor-3', () => {
  const res = functor`($0*$3)/$1`(1, 2, 3, 4)
  assertEquals(res, 2)
})

Deno.test('test-functor-4', () => {
  const res = pipe(1, functor`$0*2`, functor`{name:'jiojio',age:$0}`, functor`{ result: $0.age }`)
  assertEquals(res, { result: 2 })
})

Deno.test('test-functor-param', () => {
  const user = {
    info: {
      name: 'jiojio',
      age: 18,
      address: {
        before: 'ZXaaa',
        now: 'xxxUAaaa',
      },
    },
  }

  assertEquals('xxxUAaaa', pipe(user, functor`${($0 as typeof user).info.address.now}`))

  assertEquals(
    ['ZXaaa', 'xxxUAaaa'],
    functor<[string, string]>`[${($0 as typeof user).info.address.before},${
      ($1 as typeof user).info.address.now
    }]`(user, user)
  )
})

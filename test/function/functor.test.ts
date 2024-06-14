import { assertEquals } from '@std/assert/mod.ts'
import { Functor, pipe } from 'lib'
Deno.test('test-functor', () => {
  const Arr = [1, 2, 3, 4]
  const val = 1
  const res = Arr.map(Functor<number>(`$0+${val}`))
  assertEquals(res, [2, 3, 4, 5])
})

Deno.test('test-functor-2', () => {
  const res = pipe(1, Functor(`$0*2`), Functor(`{name:'jiojio',age:$0}`), Functor(`{ result: $0 }`))
  assertEquals(res, { result: { name: 'jiojio', age: 2 } })
})

Deno.test('test-functor-3', () => {
  const res = Functor(`($0*$3)/$1`)(1, 2, 3, 4)
  assertEquals(res, 2)
})

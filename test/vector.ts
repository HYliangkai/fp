import {assertEquals, assert, assertThrows} from '@std/assert/mod.ts'
import {Vector, vec} from 'lib'

Deno.test('vec-new', () => {
  const vn1 = vec(1)
  assert(vn1 instanceof Vector)
  const vn2 = vec('')
  assert(vn2 instanceof Vector)
  const vn3 = vec([])
  assert(vn3 instanceof Vector)
  const vn4 = vec([1, 2, 3, 4])
  assert(vn4 instanceof Vector)
})

Deno.test('vec-zip', () => {
  const le = vec([{name: 'jiojio'}, 2, 3, 4])
  const ri = vec([5, 6, 7, 8])
})

Deno.test('vec-max', () => {
  const le = vec([1, 2, 3, 4])
  const ri = vec([5, 6, 7, 8, 'Asb'])
  assertEquals(le.max().unwarp(), 4)
  assertThrows(ri.max().unwarp)
})

Deno.test('vec-min', () => {
  const le = vec(1, 2, 3, 4)
  const ri = vec([5, 6, 7, 8, 'Asb'])
  assertEquals(le.min().unwarp(), 1)
  assertThrows(ri.min().unwarp)
})

Deno.test('vec-take', () => {
  const vc = vec(1, 2, 21)
  const vc2 = vec(3, 4, 5, 6)
  const r = vc.zip(vc2).take(2)
  console.log(r)
  console.log(vc.take())
})

Deno.test('vector', () => {
  const list = [
    {name: 'dio', age: 19, address: '防抖花园'},
    {name: 'jiojio', age: 12},
    {name: 'jiojio', age: 13},
    {name: 'jiojio', age: 14},
    {name: 'jiojio', age: 16},
    {name: 'jiojio', age: 17},
    {name: 'dio', age: 18},
  ]

  const res = vec(list)
    .push('我是push')
    .pop()
    .unshift('i am unshift')
    .shift()
    .filter<{name: string; age: number; address?: string}>(i => typeof i === 'object')
    .map(i => i.age)
    .max()
    .unwarp_or(NaN)
  assertEquals(res, 19)
})

import { assertEquals } from 'https://deno.land/std@0.206.0/assert/assert_equals'
import { assert_throw } from '../../../../test/lib/assert/assert'
import { IllegalOperatError } from '../../Error/illegalError'
import { immut } from './Immut'

Deno.test('prod', () => {
  const immut_a = new immut({
    name: 'jiojio',
    age: 18,
    info: { address: 'xx-oo-dd', card: '114514' },
  })

  const copy_a = immut_a.produce((d) => {
    d.age = 20
  })

  assertEquals(copy_a.unwrap(), {
    name: 'jiojio',
    age: 20,
    info: { address: 'xx-oo-dd', card: '114514' },
  })

  const change_a = immut_a.produce((d) => `changed`)
  assertEquals(change_a.unwrap(), `changed`)

  const err_a = immut_a.produce((d) => {
    d.age = 20
    return 'changed'
  })
  console.log(err_a)
  assert_throw(() => {
    err_a.unwrap()
  }, IllegalOperatError)
})

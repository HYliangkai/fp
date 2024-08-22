import { assertEquals } from '@std/assert/mod.ts'
import { IllegalOperatError, Immut } from '@chzky/fp'

Deno.test('immut-base', () => {
  const immut_a = Immut({
    name: 'jiojio',
    age: 18,
    info: { address: 'xx-oo-dd', card: '114514' },
  })

  const copy_a = immut_a.produce((d) => {
    d.age = 20
  })

  assertEquals(copy_a.unwrap().source, {
    name: 'jiojio',
    age: 20,
    info: { address: 'xx-oo-dd', card: '114514' },
  })

  const change_a = immut_a.produce((d) => `changed`)
  assertEquals(change_a.unwrap().source, `changed`)

  const err_a = immut_a.produce((d) => {
    d.info.card = 'aasd'
    return 'changed'
  })
  err_a.unwrap_err().instance_of(IllegalOperatError)
})

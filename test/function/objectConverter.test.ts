import {object_converter, zod} from 'lib'
import {assertEquals, assertThrows} from '../mod.ts'

const converter = object_converter(
  zod.object({
    name: zod.string(),
    age: zod.number(),
  }),
  zod.object({
    rname: zod.string(),
    rage: zod.number(),
  }),
  {
    name: 'rname',
    age: 'rage',
  }
)
Deno.test('obj-converter-base', () => {
  const input = {name: 'jiojio', age: 18}

  const res = converter.serialize(input).unwarp()
  assertEquals(res, {rname: 'jiojio', rage: 18})

  const res_input = converter.deserialize(res).unwarp()
  assertEquals(res_input, input)
})

Deno.test('obj-converter-err', () => {
  assertThrows(() => {
    //@ts-ignore
    converter.serialize({name: 12, age: 12}).unwarp()
  })
  assertThrows(() => {
    //@ts-ignore
    const res = converter.serialize({age: 12}).unwarp()
    console.log(res)
  })
})

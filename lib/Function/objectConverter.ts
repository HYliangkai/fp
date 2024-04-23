import {Err, KOZodInfer, MaybeSerialize, Ok, ZodInfer, zod} from '../../mod.ts'
/** ## object_converter : 提供一个object的key名快速转换操作
@example
```ts
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
  const input = {name: 'jiojio', age: 18}

  const res = converter.serialize(input).unwarp()
  assertEquals(res, {rname: 'jiojio', rage: 18})

  const res_input = converter.deserialize(res).unwarp()
  assertEquals(res_input, input)

  assertThrows(() => {
    converter.serialize({name: 12, age: 12}).unwarp()
  })

  assertThrows(() => {
    const res = converter.serialize({age: 12}).unwarp()
    console.log(res)
  })
```
@category Function

*/
export const object_converter = <A extends zod.ZodSchema<object>, B extends zod.ZodSchema<object>>(
  schema_a: A,
  schema_b: B,
  relation: Record<keyof ZodInfer<A>, keyof ZodInfer<B>>
): MaybeSerialize<ZodInfer<A>, ZodInfer<B>, zod.ZodError> => {
  return {
    serialize: (data: ZodInfer<A>) => {
      try {
        schema_a.parse(data)
        const res = {} as ZodInfer<B>
        for (const [key, value] of Object.entries(data)) {
          if (relation[key as KOZodInfer<A>] === undefined) {
            continue /* 如果在映射关系中不存在就直接略过 */
          } else {
            res[relation[key as KOZodInfer<A>] as KOZodInfer<B>] = value
          }
        }
        schema_b.parse(res)
        return Ok(res)
      } catch (err) {
        return Err(err as zod.ZodError)
      }
    },
    deserialize: (data: ZodInfer<B>) => {
      try {
        schema_b.parse(data)
        const res = {} as ZodInfer<A>
        for (const [okey, nkey] of Object.entries(relation)) {
          res[okey as KOZodInfer<B>] = data[nkey as KOZodInfer<A>]
        }
        schema_a.parse(res)
        return Ok(res)
      } catch (err) {
        return Err(err as zod.ZodError)
      }
    },
  }
}

import {Err, Ok, Serialize, zod, type Result} from '../../mod.ts'

type ZodInfer<T extends zod.ZodSchema> = zod.infer<T>

/** ## value_type_change : 提供一个object的key名快速转换操作  */
export const value_conversion = <A extends zod.ZodSchema<object>, B extends zod.ZodSchema<object>>(
  schema_a: A,
  schema_b: B,
  realtion: Record<keyof ZodInfer<A>, keyof ZodInfer<B>>
): Serialize<ZodInfer<A>, ZodInfer<B>> => {
  return {
    serialize: (data: ZodInfer<A>): Result<ZodInfer<B>, zod.ZodError> => {
      try {
        schema_a.parse(data)
        const res = {} as ZodInfer<B>
        for (const [key, value] of Object.entries(data)) {
          const rkey = realtion[key as keyof ZodInfer<A>]
          res[rkey as keyof ZodInfer<B>] = value
        }
        schema_b.parse(res)
        return Ok(res)
      } catch (err) {
        return Err(err as zod.ZodError)
      }
    },
    deserialize: (data: ZodInfer<B>): Result<ZodInfer<A>, zod.ZodError> => {
      try {
        schema_b.parse(data)
        const res = {} as ZodInfer<A>
        const kv = []

        for (const [key, value] of Object.entries(data)) {
          kv.push([key, value])
        }

        schema_a.parse(res)
        return Ok(res)
      } catch (err) {
        return Err(err as zod.ZodError)
      }
    },
  }
}

const converser = value_conversion(
  zod.object({name: zod.string(), age: zod.number()}),
  zod.object({rname: zod.string(), rage: zod.number()}),
  {
    name: 'rname',
    age: 'rage',
  }
)

import type { Refer, Record, Tuple } from '@chzky/fp'

/** ## `RecordObject` : Record支持的数据结构
@example Usage
```ts
  const rec = Record({
    name: 'jiojio',
    age: Refer(18),
  })

  // set data will throw error
  assert_throw(() => {
    //@ts-ignore : test
    rec.safe().age = 20
  }, ReadOnlyError)

  // eq
  assert(
    rec.eq(
      Record({
        name: 'jiojio',
        age: Refer(18),
      })
    )
  )

  //配合Refer实现内部可变
  const rec = Record({
    name: 'jiojio',
    age: Refer(18),
  })
  rec.safe().age.update(20)
  assert(rec.safe().age.value === 20)
```
@category TypeClass
 */
export interface RecordObject {
  [key: string]:
    | string
    | number
    | boolean
    | Record<RecordObject>
    | Refer<any>
    | Tuple<unknown, number>
}

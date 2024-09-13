import { assert_throw, assert } from '@chzky/cest'
import { ReadOnlyError, Record } from '@chzky/fp'
import { Refer } from '../../lib/mod.ts'

Deno.test('record-basic', () => {
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

  const ref = rec.get('age')
  ref.update(20)
  assert(ref.value === 20)
})

Deno.test('Internal variability', () => {
  //配合Refer实现内部可变
  const rec = Record({
    name: 'jiojio',
    age: Refer(18),
  })
  rec.safe().age.update(20)
  assert(rec.safe().age.value === 20)
})

Deno.test('record-kv-nosupport', () => {
  assert_throw(() => {
    Record({
      //@ts-ignore : test
      cb: () => {},
    })
  }, TypeError)
  assert_throw(() => {
    Record({
      //@ts-ignore : test
      [Symbol('ss')]: () => {},
    })
  }, TypeError)

  assert_throw(() => {
    Record({})
  }, TypeError)
})

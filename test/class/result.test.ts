import {
  AnyErr,
  AnyError,
  AnyResult,
  Default,
  Err,
  flow,
  functor,
  None,
  Ok,
  panic,
  result,
  Result,
  Some,
} from '@chzky/fp'
import { assertEquals, assertThrows } from '../mod.ts'
import { assert } from '@std/assert/mod.ts'

Deno.test('result-method', () => {
  const defable: Default<boolean> = { default: () => true }
  class DefAble {
    static default() {
      return true
    }
  }
  const oterr = AnyError.new('Error', 'test error', 'Test')
  const err = AnyErr('Error', 'test error', 'Test')
  const ok = Ok(true)
  const result: AnyResult<boolean> = Date.now() % 2 === 0 ? ok : err

  assertThrows(err.unwrap)
  assert(result.unwrap_or(true))
  try {
    err.expect('Test')
  } catch (e) {
    assert(e === 'Test')
  }

  assert(err.unwrap_err().eq(oterr))
  assert(ok.unwrap_err().eq(AnyError.new('Error', 'Ok value not error', 'ResultError')))
  assert(result.unwrap_or_else((e) => e.eq(oterr)))
  assert(err.unwrap_or_default(defable))
  assert(err.unwrap_or_default(DefAble))

  assert(ok.into('option').is_some)
  assert(err.into('option').is_none)
  assert(ok.into('either').is_left)
  assert(err.into('either').is_right)

  assert(ok.as('boolean'))
  assert(!err.as('boolean'))
})

Deno.test('result-constaructor', () => {
  const one = Some(true)
  const two = None
  assert(result.from(one).unwrap())
  assert(result.from(two).is_err)

  const res1 = result<number, AnyError<'Debug'>>(() => {
    if (Date.now() % 2 === 0) panic('Debug', '测试错误', 'Test')
    return 1
  })
  res1.match(
    (ok) => {
      assert(ok === 1)
    },
    (err) => {
      assert(err.eq(AnyError.new('Debug', '测试错误', 'Test')))
    }
  )
})

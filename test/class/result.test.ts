import { AnyErr, AnyError, AnyResult, Default, Err, Ok, Result } from 'lib'
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

  assertThrows(err.unwarp)
  assert(result.unwarp_or(true))
  try {
    err.expect('Test')
  } catch (e) {
    assert(e === 'Test')
  }

  assert(err.unwarp_err().eq(oterr))
  assert(ok.unwarp_err().eq(AnyError.new('Error', 'Ok value not error', 'ResultError')))
  assert(result.unwrap_or_else((e) => e.eq(oterr)))
  assert(err.unwarp_or_default(defable))
  assert(err.unwarp_or_default(DefAble))

  assert(ok.into('option').is_some)
  assert(err.into('option').is_none)
  assert(ok.into('either').is_left)
  assert(err.into('either').is_right)
})

import { AnyError, None, NoneError, Some, UnexpectedError, option } from '@chzky/fp'
import { assert, assertEquals, assertThrows } from '../mod.ts'

Deno.test('option function', () => {
  // Test when value is undefined
  const undefinedOption = option(undefined)
  assert(undefinedOption === None, 'Should return None for undefined')

  // Test when value is null
  const nullOption = option(null)
  assert(nullOption === None, 'Should return None for null')

  // Test when value is a non-null and non-undefined value
  const value = 'test value'
  const valueOption = option(value)
  assertEquals(
    valueOption,
    Some(value),
    'Should return Some(value) for non-null and non-undefined values'
  )
})

Deno.test('option-methods', () => {
  const some = Some(true)
  const none = None
  const option = Date.now() % 2 === 0 ? some : none

  assert(some.unwrap())
  assert(some.expect(UnexpectedError))
  assert(some.unwrap_or(false))
  try {
    none.unwrap()
  } catch (e) {
    ;(e as AnyError).eq(NoneError.new())
  }
  try {
    none.unwrap_or(UnexpectedError.new())
  } catch (e) {
    ;(e as AnyError).eq(UnexpectedError.new())
  }
})

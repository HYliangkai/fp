import {None, Some, option} from 'lib'
import {assert, assertEquals} from '../mod.ts'

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

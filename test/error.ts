import {
  assert,
  assertFalse,
  assertEquals,
  assertThrows,
} from 'https://deno.land/std@0.206.0/assert/mod.ts'

import {AnyError, anyresult, match_error, panic} from 'lib'

Deno.test('error-init', () => {
  const error = new AnyError()
  assert(error instanceof AnyError)
  assertFalse(error instanceof Error)
  assertEquals(error.type, 'Error')

  const err2 = AnyError.new('Debug', {name: 'DebugTest', type: 'Debug'})
  assert(err2 instanceof AnyError)
  assertFalse(err2 instanceof Error)
  assertEquals(err2.type, 'Debug')
})

Deno.test('error-fn', () => {
  const error = AnyError.new('testing')
  let flag = false
  for (const stark of error.strack_trace().split('\n')) {
    if (stark.includes(import.meta.url)) {
      flag = true
    }
  }
  assert(flag)

  assert(error.value().cause == 'testing')

  assertThrows(error.throw)
})

Deno.test('match_error : Function', () => {
  const pattern = match_error(AnyError.new())
  pattern.error(
    error => {
      assert(error instanceof AnyError)
    },
    () => {}
  )
})

Deno.test('anyresult', () => {})

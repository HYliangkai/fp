import {promise_time_limit} from 'lib'
import {assertEquals, fail} from '../mod.ts'

// Test case 1: Promise resolves within the time limit
Deno.test('promise_time_limit resolves within the time limit', async () => {
  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve('Test')
    }, 100)
  })

  const result = await promise_time_limit(200, promise)
  assertEquals(result, 'Test')
})

// Test case 2: Promise rejects within the time limit
Deno.test('promise_time_limit rejects within the time limit', async () => {
  const promise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Test Error'))
    }, 100)
  })

  try {
    await promise_time_limit(200, promise)
    fail('Expected promise_time_limit to throw an error')
  } catch (error) {
    assertEquals(error.message, 'Test Error')
  }
})

// Test case 3: Promise exceeds the time limit
Deno.test('promise_time_limit exceeds the time limit', async () => {
  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve('Test')
    }, 300)
  })

  try {
    await promise_time_limit(200, promise)
    fail('Expected promise_time_limit to throw an error')
  } catch (error) {
    assertEquals(error.message, 'time out')
  }
  await new Promise(res => {
    setTimeout(res, 100)
  })
})

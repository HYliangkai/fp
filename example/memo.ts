/** 函数缓存的示例 */

import { memo } from '@chzky/fp'

//斐波那契算法
const fibonacci = (n: number): number => {
  return n <= 1 ? 1 : fibonacci(n - 1) + fibonacci(n - 2)
}
const cache = memo(fibonacci)
Deno.bench('cache', () => {
  cache(5)
  cache(4)
  cache(6)
  cache(6)
  cache(10)
  cache(10)
  cache(10)
  cache(10)
  cache(10)
  cache(10)
  cache(10)
})

Deno.bench('no-cache', () => {
  fibonacci(5)
  fibonacci(4)
  fibonacci(6)
  fibonacci(6)
  fibonacci(10)
  fibonacci(10)
  fibonacci(10)
  fibonacci(10)
  fibonacci(10)
  fibonacci(10)
})

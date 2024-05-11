type CFn<T> = (...args: any[]) => T
/** ## memo 函数缓存,源至[tc39的提案](https://github.com/tc39/proposal-function-memo)
@expample
```ts
const fib = memo(function (n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2)
})
fib(10) // 55
fib(10) // 55 --> fast , because of cache
```
@param func 要缓存的函数
@returns 返回一个缓存函数
@category Function
*/
export const memo = <T>(func: CFn<T>): CFn<T> => {
  if (typeof func !== 'function') throw new TypeError('Expected a function')

  const memoized = function (...args: any[]) {
    const key = args[0]
    const cache = memoized.cache
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = func(...args)
    memoized.cache = cache.set(key, result) || cache
    return result
  }
  memoized.cache = new (memo.Cache || Map)()
  return memoized
}
memo.Cache = Map

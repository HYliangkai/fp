type CFn<T> = (...args: any[]) => T
/** ## memo 函数缓存,源至[tc39的提案](https://github.com/tc39/proposal-function-memo)
@expample
```ts
const fib = memo(function (n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2)
})
fib(10) // 55
fib(10) // 55 --> fast , because of cache


const sum = memo((a, b)=>({a,b}),(i)=>i.a)
sum(1,2) // {a:1,b:2}
sum(2,2) // {a:2,b:2}
sum(1,3) // {a:1,b:2} --> cache with key a:1

```
@param func 要缓存的函数
@param resolver 生成缓存的key的函数,默认使用第一个参数作为key
@returns 返回一个缓存函数
@category Function
*/
export const memo = <T>(func: CFn<T>, resolver?: (...val: any[]) => any): CFn<T> => {
  if (typeof func !== 'function') throw new TypeError('Expected a function')
  const memoized = function (...arg: any) {
    const key = resolver ? resolver(...arg) : arg[0]
    const cache = memoized.cache
    if (cache.has(key)) return cache.get(key)
    const result = func(arg)
    memoized.cache = cache.set(key, result) || cache
    return result
  }
  memoized.cache = new (memo.Cache || WeakMap)()
  return memoized
}
memo.Cache = WeakMap

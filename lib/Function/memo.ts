/** 函数缓存,源至[tc39的提案](https://github.com/tc39/proposal-function-memo) */

export const memo = (func: Function) => {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
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

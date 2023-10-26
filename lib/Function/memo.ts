/** 函数缓存,源至[tc39的提案](https://github.com/tc39/proposal-function-memo) */
export const memo = (fn: Function) => {
  const cache = new Map()
  return (...args: any[]) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    } else {
      const result = fn(...args)
      cache.set(key, result)
      return result
    }
  }
}

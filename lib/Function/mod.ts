export * from './pipe.ts' //参数调用平行化
export * from './flow.ts' //科里化的pipe
export * from './memo.ts' //函数缓存
export * from './match.ts' //模式匹配
export * from './primitive.ts' //原语
export * from './lazyPipe.ts' //lazy版的pipe
export * from './algebraicEffect.ts' //代数效应

/** ##  Default : global default value 
  @category Constant
*/
export const Def = Symbol('default')

export const is_async_func = (fn: Function) => {
  if (fn.constructor.name === 'AsyncFunction') return true
  //@ts-ignore : 使用Promise A+ 规范来判断Promise
  if ('function' == typeof fn.then) return true
  return false
}

export * from './pipe.ts' //参数调用平行化
export * from './flow.ts' //科里化的pipe
export * from './memo.ts' //函数缓存
export * from './curry.ts' //函数科里化
export * from './match.ts' //模式匹配
export * from './lazyPipe.ts' //lazy版的pipe
export * from './primitive.ts' //原语
export * from './isAsyncFunc.ts' //判断是否是异步函数
export * from './algebraicEffect.ts' //代数效应
// export * from  './functor.ts' //函数解析器 : 测试阶段

/** ##  Default : global default value 
  @category Constant
*/
export const Def = Symbol('default')

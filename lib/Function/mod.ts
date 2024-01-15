export * from './pipe.ts' //参数调用平行化
export * from './flow.ts' //科里化的pipe
export * from './memo.ts' //函数缓存
export * from './copy.ts' //拷贝
export * from './sleep.ts' //线程休眠
export * from './value.ts' //获取value[key]值
export * from './match.ts' //模式匹配
export * from './delegates.ts' //事件代理
export * from './uniqueId.ts' //唯一id
export * from './lazyPipe.ts' //lazy版的pipe
export * from './algebraicEffect.ts' //代数效应

/** ##  Default : global default value */
export const Def = Symbol('default')

export type JudeCondition<T> = (val: T) => boolean
export type Condition<T> = T | JudeCondition<T>

export * from './functor.ts'

/** ##  Default : 全局的默认实现Value
如何获得?
1. 调用`Default.default()`
2. 直接调用
  @category Constant
*/
export const Def = Symbol('default')
export type Def = typeof Def

/** @category Constant */
export const error_tag = Symbol('error')

/** @category Constant */
export const ok_tag = Symbol('ok')

/** @category Constant */
export const empty_tag = Symbol('empty')

/** @category Constant */
export const state_tag = Symbol('state')

/** @category Constant */
export const left_tag = Symbol('left')

/** @category Constant */
export const right_tag = Symbol('right')

/** @category Constant */
export const some_tag = Symbol('some')

/** @category Constant */
export const none_tag = Symbol('none')

/** @category Constant */
export const future_tag = Symbol('future')

/** @category Constant */
export const match_return_tag = Symbol('match_return')



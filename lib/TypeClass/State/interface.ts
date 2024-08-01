import { type Fn, type Draft, type Refer, state_tag } from '../../../mod.ts'

export interface State<M, S> {
  readonly _tag: typeof state_tag

  readonly struct: { main: M; effect: S }

  /** ### map : 更新main数据  */
  map: <R>(f: Fn<M, R>) => State<R, S>
  /** ### chain : 更新,返回一个全新的State数据  */
  chain: <O, R>(f: Fn<[M, S], [O, R]>) => State<O, R>
  /** ### ap : 更新effect数据  */
  ap: <R>(f: Fn<S, R>) => State<M, R>
  /** ### rep : 替换effect数据 */
  rep: <R>(effect: R) => State<M, R>
  /** ### draft : 使用immer以 *不可变数据结构* 的形式更新数据
  + 产生的新数据和旧数据是相互独立的,不会相互影响
  */
  draft: <O = M, V = S>(f: Fn<Draft<[Refer<O>, Refer<V>]>, unknown>) => State<O, V>

  /** ### unwrap : 获取main数据*/
  unwrap: () => M
  /** ### effect : 获取effect数据*/
  effect: () => S
}

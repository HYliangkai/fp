import {
  type Fn,
  type Draft,
  type Result,
  type IllegalOperatError,
  state_tag,
  enableMapSet,
  enablePatches,
  Immut,
  Err,
  Ok,
} from '@chzky/fp'

export interface State<M, S> {
  readonly _tag: typeof state_tag

  /** State的数据 */
  readonly struct: { main: M; effect: S }

  /** ### `map` : 更新main数据  */
  map: <R>(f: Fn<M, R>) => State<R, S>
  /** ### `chain` : 更新,返回一个全新的State数据  */
  chain: <O, R>(f: Fn<[M, S], [O, R]>) => State<O, R>
  /** ### `ap` : 更新effect数据  */
  ap: <R>(f: Fn<S, R>) => State<M, R>
  /** ### `rep` : 替换effect数据 */
  rep: <R>(effect: R) => State<M, R>

  /** ### `draft` : 使用{@link Immut}以 *不可变数据结构* 的形式更新数据
  + 产生的新数据和旧数据是相互独立的,不会相互影响
  @example Uasge
  ```
  */
  draft: <R = void>(
    f: Fn<Draft<[M, S]>, R>
  ) => Result<
    R extends void ? State<M, S> : R extends [infer A, infer B] ? State<A, B> : never,
    IllegalOperatError | TypeError
  >

  /** ### `unwrap` : 获取main数据*/
  unwrap: () => M
  /** ### `effect` : 获取effect数据*/
  effect: () => S
}

class state<M, S> implements State<M, S> {
  readonly _tag: typeof state_tag = state_tag

  readonly struct: { main: M; effect: S }

  constructor(main: M, effect: S) {
    enableMapSet()
    enablePatches()
    this.struct = { main, effect }
  }
  static new<M, S>(main: M, effect: S): State<M, S> {
    return new state(main, effect)
  }

  map<B>(f: Fn<M, B>): State<B, S> {
    return state.new(f(this.struct.main), this.struct.effect)
  }
  chain<B, R>(f: Fn<[M, S], [B, R]>): State<B, R> {
    return state.new(...f([this.struct.main, this.struct.effect]))
  }
  ap<B>(f: Fn<S, B>): State<M, B> {
    return state.new(this.struct.main, f(this.struct.effect))
  }
  rep<R>(effect: R): State<M, R> {
    return state.new(this.struct.main, effect)
  }

  draft<R = void>(
    f: Fn<Draft<[M, S]>, R>
  ): Result<
    R extends void ? State<M, S> : R extends [infer A, infer B] ? State<A, B> : never,
    IllegalOperatError | TypeError
  > {
    const clone = Immut<[M, S]>([this.struct.main, this.struct.effect]).produce(f)
    if (clone.is_err) return clone as Result<never, IllegalOperatError>
    const data = clone.unwrap().source
    if (Array.isArray(data) && data.length === 2)
      return Ok(state.new(data[0], data[1])) as Result<any, never>
    return Err(new TypeError('draft function must return a tuple [X,Y]'))
  }

  unwrap(): M {
    return this.struct.main
  }
  effect(): S {
    return this.struct.effect
  }
}

/** ## `State` : 主数据与(状态/副作用)数据进行隔离的数据结构
@example Usage1 : 用于简化多参数函数的调用
```ts
  //正常情况下函数传入多个参数的情况
  function main(info: INFO, is_man: boolean) {
    if_then(is_man, () => {
      assertEquals(info, { name: 'jiojio', age: 18 })
    })
  }
  //在main函数中,不变的是info信息,而is_man是变化的,所以可以使用State-effect来存储is_man的状态
  function main_change(state: State<INFO, IS_MAN>) {
    if_then(state.effect(), () => {
      assertEquals(state.unwrap(), info)
    })
  }
```
@example Usage2 : 配合`pipe`函数存储过程数据  
```ts
//pipe函数虽然让函数调用变得十分优雅,但是有一个问题就是只能返回一个值,但是有时候我们需要返回多个值(譬如不想多次计算的计算结果,这些数据属于状态数据,对于结果没有影响但是为了提高效率要用得到),这时候就可以使用State将主要数数据和副作用数据进分隔开
  function step1(info: INFO) {
    info.age += 1
    const comput_freq = 1
    return state(info, comput_freq)
  }
  function step2(state: State<INFO, number>) {
    if_then(state.unwrap().name == 'jiojio', () => {
      main_change(state.rep(true))
    })
    // 更新数据,进行数据隔离
    const as2 = state.draft(([main, effect]) => {
      //要更新数据必须先取出value值,然后进行操作
      main.value.age += 1
      //更新副作用数据
      effect.value = 2
    })
    // 旧数据 
    assert(state.unwrap().age === 19)
    // 新数据 
    assert(as2.unwrap().age === 20)
    
    assert(as2.effect() === 2)
  }
  pipe(info, step1, step2)
```
@category TypeClass
 */
export function State<M, S>(main: M, effect: S): State<M, S> {
  return state.new(main, effect)
}

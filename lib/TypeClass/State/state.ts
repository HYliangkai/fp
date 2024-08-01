import {
  type Fn,
  type Refer,
  type Draft,
  refer,
  state_tag,
  enableMapSet,
  enablePatches,
  produce,
} from '../../../mod.ts'

import { State as STATE } from './interface.ts'

enableMapSet()
enablePatches()

class State<M, S> implements STATE<M, S> {
  readonly _tag: typeof state_tag = state_tag

  readonly struct: { main: M; effect: S }

  constructor(main: M, effect: S) {
    this.struct = { main, effect }
  }
  static new<M, S>(main: M, effect: S) {
    return new State(main, effect)
  }

  map<B>(f: Fn<M, B>): State<B, S> {
    return State.new(f(this.struct.main), this.struct.effect)
  }
  chain<B, R>(f: Fn<[M, S], [B, R]>) {
    return State.new(...f([this.struct.main, this.struct.effect]))
  }
  ap<B>(f: Fn<S, B>) {
    return State.new(this.struct.main, f(this.struct.effect))
  }
  rep<R>(effect: R) {
    return State.new(this.struct.main, effect)
  }
  draft<O = M, V = S>(f: Fn<[Draft<Refer<O>>, Draft<Refer<V>>], unknown>) {
    const [main, effect] = produce(
      [refer(this.struct.main), refer(this.struct.effect)],
      (dratf: [Draft<Refer<O>>, Draft<Refer<V>>]) => {
        f(dratf)
      }
    )
    return State.new(main.value as unknown as O, effect.value as unknown as V)
  }

  unwrap() {
    return this.struct.main
  }
  effect() {
    return this.struct.effect
  }
}

/** ## state : 主数据与状态/副作用数据进行隔离的数据结构
@example Usage1 : 用于简化多参数函数的调用
```ts
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
export function state<M, S>(main: M, effect: S): State<M, S> {
  return State.new(main, effect)
}

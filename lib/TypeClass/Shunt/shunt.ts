import { mainstream_tag, reflux_tag, type Shunt } from '@chzky/fp'

class mains<M> implements Shunt<M, never> {
  _tag: typeof mainstream_tag = mainstream_tag
  constructor(public value: M) {}
  unwrap(): M {
    return this.value
  }
}

class refls<B> implements Shunt<never, B> {
  _tag: typeof reflux_tag = reflux_tag
  constructor(public value: B) {}
  unwrap(): B {
    return this.value
  }
}

/** ## `Mainstream<T>`(主流) : 生成`Shunt<T,never>`类型数据 */
export function Mainstream<T>(val: T): Shunt<T, never> {
  return new mains(val)
}

export function is_mainstream(m: unknown): m is Shunt<any, never> {
  return m instanceof mains
}

/** ## `Reflux<T>`(回流) : 生成`Shunt<never,T>`类型数据 */
export function Reflux<T>(val: T): Shunt<never, T> {
  return new refls(val)
}

export function is_reflux(m: unknown): m is Shunt<never, any> {
  return m instanceof refls
}

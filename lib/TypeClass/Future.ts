import { future_tag } from '../../mod.ts'
import { AsyncResult } from './Result.ts'
/** ## Future : 异步返回数据 */

class Future<T, E> {
  _tag = future_tag
  fn: () => AsyncResult<T, E>

  constructor(fn: () => AsyncResult<T, E>) {
    this.fn = fn
  }

  async unwarp() {
    return (await this.fn()).unwarp()
  }

  async expect(msg: string) {
    return (await this.fn()).expect(msg)
  }

  async unwarp_or(def: T) {
    return (await this.fn()).unwarp_or(def)
  }

  async unwarp_err() {
    return (await this.fn()).unwarp_err()
  }

  async unwrap_or_else(fn: (err: E) => T) {
    return (await this.fn()).unwrap_or_else(fn)
  }

  async map<V = T>(func: (val: T) => V) {
    return (await this.fn()).map(func as any)
  }

  async map_err<V>(fn: (err: E) => V) {
    return (await this.fn()).map_err(fn as any)
  }

  async and_then<V>(fn: (val: T) => AsyncResult<V, E>) {
    return (await this.fn()).and_then(fn as any)
  }
}

export function future<T, E>(fn: () => AsyncResult<T, E>) {
  return new Future(fn)
}

import {
  castImmutable,
  type IllegalOperatError,
  type Result,
  type Draft,
  type Immutable,
  Ok,
} from '@chzky/fp'
import { immut_produce } from './core.ts'

/** ## `Immut` : 将数据变为`不可变`数据
底层使用 `immer` 实现
### 使用场景
1. 需要显式声明数据为不可变数据
2. 需要数据深拷贝
*/
export interface Immut<T> {
  readonly source: Immutable<T>

  /** ### `produce` : 拷贝数据,对数据的修改在fn中进行
  1. 如果在fn中返回数据,并且在回调中没有修改过draft,则返回fn的返回值 ;  
  2. 如果在fn中没有返回数据,则返回修改后的draft;  
  + 即:`修改draft`和`返回新数据`是互斥的,如果同时进行操作则会返回`IllegalOperatError`
  @example Usage
  ```ts
  const immut_a = new immut({
    name: 'jiojio',
    age: 18,
    info: { address: 'xx-oo-dd', card: '114514' },
  })

  const copy_a = immut_a.produce((d) => {
    d.age = 20
  })

  assertEquals(copy_a.unwrap().source, {
    name: 'jiojio',
    age: 20,
    info: { address: 'xx-oo-dd', card: '114514' },
  })

  const change_a = immut_a.produce((d) => `changed`)
  assertEquals(change_a.unwrap(), `changed`)

  const err_a = immut_a.produce((d) => {
    d.info.card = 'aasd'
    return 'changed'
  })
  err_a.unwrap_err().instance_of(IllegalOperatError)
  ```
   */
  produce: <R = void>(
    fn: (draft: Draft<T>) => R
  ) => Result<Immut<R extends void ? T : R>, IllegalOperatError>

  /** ### `use` :  */
  // use: (fn: (draft: T) => void) => void
}

class immut<T> implements Immut<T> {
  readonly source: Immutable<T>

  constructor(source: T) {
    this.source = castImmutable(source)
  }

  produce<R = void>(
    fn: (draft: Draft<T>) => R
  ): Result<Immut<R extends void ? T : R>, IllegalOperatError> {
    const res = immut_produce<T, R>(this.source, fn)
    if (res.is_err) return res as Result<never, IllegalOperatError>
    return Ok(new immut(res.unwrap())) as Result<Immut<R extends void ? T : R>, never>
  }

  /** ### `deep`: 将数据进行拷贝 - `Immut.produce`的静态版本 */
  // static deep<T, R = void>(
  //   data: T,
  //   fn: (draft: T) => R
  // ): Result<Immutable<R extends void ? T : R>, IllegalOperatError>
  // static deep<T, R = void>(
  //   fn: (draft: T) => R
  // ): Fn<T, Result<Immutable<R extends void ? T : R>, IllegalOperatError>>
  // static deep<T, R = void>(p1: T | ((draft: T) => R), fn?: (draft: T) => R): any {
  //   if (fn) return immut_produce(castImmutable(p1 as T), fn)
  //   return (data: T) => immut_produce(castImmutable(data as T), p1 as (draft: T) => R)
  // }
}

export function Immut<T>(source: T): Immut<T> {
  return new immut(source)
}

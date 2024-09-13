import {
  castImmutable,
  type IllegalOperatError,
  type Result,
  type Draft,
  type Immutable,
  type PartialEq,
  Ok,
} from '@chzky/fp'
import { immut_produce } from './core.ts'
import { immer_proxy } from 'internal/_immerProxy.ts'
import { equal } from 'internal/_equal.ts'

/** ## `Immut` : 将数据变为`不可变`数据
底层使用 `immer` 实现
### 使用场景
1. 需要显式声明数据为不可变数据
2. 需要数据深拷贝
*/
export interface Immut<T> extends PartialEq {
  /** `source` : 源数据  
  @tips 不要对其做修改操作;为了优化性能没有对数据源做多余的劫持 */
  readonly source: Immutable<T>

  /** ### `safe` : 对数据源做不可变劫持 */
  safe(): Immutable<T>

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

  safe(): Immutable<T> {
    if (typeof this.source === 'object') return immer_proxy(this.source as object) as Immutable<T>
    return this.source
  }

  /** 调用{@link equal}函数进行相等性判断 */
  eq(other: this): boolean {
    return equal(this.source, other.source)
  }
}

export function Immut<T>(source: T): Immut<T> {
  return new immut(source)
}

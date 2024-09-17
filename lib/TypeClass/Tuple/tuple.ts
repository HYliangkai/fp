import {
  Ok,
  Immut,
  castImmutable,
  type As,
  type Draft,
  type Result,
  type Immutable,
  type RangeNumber,
  type IllegalOperatError,
} from '@chzky/fp'

import { immer_proxy } from 'internal/_immerProxy.ts'
import { equal } from 'internal/_equal.ts'

import { tuple_type_check } from './core.ts'
import { immut_produce } from '../Immut/core.ts'
import type { TupleArray, TupleItem } from './interface.ts'

/** ## `Tuple` :`Immut<Array>`的特化,源于[proposal-record-tuple](https://github.com/tc39/proposal-record-tuple)提案
### Feature : Tuple
1. value值只支持以下几种类型 : `string` | `number` | `boolean` | `Record` | `Tuple` | `Refer` 
2. 当尝试使用其他类型作为value值时,会抛出`TypeError`
3. 当尝试使用空数组时,会抛出`TypeError`
@example Usage
```ts
  const tup = Tuple([1, false, 'xxm'])

  assert_throw(() => {
    //@ts-ignore : cannot change
    tup.safe()[1] = 12
  }, ReadOnlyError)

  assert(tup.eq(Tuple.of(1, false, 'xxm')))
```
@category TypeClass
*/
export interface Tuple<T, N extends number>
  extends Immut<TupleArray<T, N>>,
    As<TupleArray<T, N>, 'array'> {
  /** ### `at` : 获取index值 */
  at(index: RangeNumber<N>): T
}

class tuple<T extends TupleItem, N extends number> implements Tuple<T, N> {
  readonly source: Immutable<TupleArray<T, N>>

  constructor(tuple_array: TupleArray<T, N>) {
    tuple_type_check(tuple_array)
    this.source = castImmutable(tuple_array)
  }

  produce<R = void>(
    fn: (draft: Draft<TupleArray<T, N>>) => R
  ): Result<Immut<R extends void ? TupleArray<T, N> : R>, IllegalOperatError> {
    const res = immut_produce(this.source, fn as any)
    if (res.is_err) return res as Result<never, IllegalOperatError>
    return Ok(Immut(res.unwrap())) as Result<Immut<R extends void ? TupleArray<T, N> : R>, never>
  }

  at(index: number): T {
    return this.safe().at(index) as T
  }

  safe(): Immutable<TupleArray<T, N>> {
    return immer_proxy(this.source) as Immutable<TupleArray<T, N>>
  }

  eq(other: this): boolean {
    return equal(this.source, other.source)
  }

  as(flag: 'array'): TupleArray<T, N> {
    if (flag === 'array') return this.source as TupleArray<T, N>
    throw new TypeError('Tuple.as() only support flag : array')
  }
}

function _tuple<T extends TupleItem, N extends number>(tuple_array: TupleArray<T, N>): Tuple<T, N> {
  return new tuple(tuple_array) as Tuple<T, N>
}

export const Tuple: typeof _tuple & {
  of: <T extends TupleItem, N extends number>(...items: TupleArray<T, N>) => Tuple<T, N>
} = Object.assign(_tuple, {
  /** ### `of` : 创建一个Tuple实例
  @example Usage
  ```ts
    const tuple = Tuple.of(1, 2, 3, 4, 5)
    assert(tuple.at(0) === 1)
  ```
   */
  of<T extends TupleItem, N extends number>(...items: TupleArray<T, N>): Tuple<T, N> {
    return new tuple(items) as Tuple<T, N>
  },
})

function is_tuple(val: unknown): val is Tuple<any, number> {
  return val instanceof tuple
}

export { is_tuple, type TupleArray }

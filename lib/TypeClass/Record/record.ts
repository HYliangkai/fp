import {
  Ok,
  Immut,
  castImmutable,
  type As,
  type Draft,
  type Result,
  type Immutable,
  type IllegalOperatError,
} from '@chzky/fp'

import { equal } from 'internal/_equal.ts'
import { immer_proxy } from 'internal/_immerProxy.ts'

import { record_type_check } from './core.ts'
import { immut_produce } from '../Immut/core.ts'
import type { RecordObject } from './interface.ts'

/** ## `Record<T>` : `Immut<object>`的特化,源于[proposal-record-tuple](https://github.com/tc39/proposal-record-tuple)提案
### Feature : Record支持的类型
1. key值不可为`symbol`
2. value值只支持以下几种类型 : `string` | `number` | `boolean` | `Record` | `Tuple` | `Refer` 
3. 当尝试使用其他类型作为key/value值时,会抛出`TypeError`
4. 当尝试使用空对象时,会抛出`TypeError`
*/
export interface Record<T extends RecordObject> extends Immut<T>, As<T, 'object'> {
  /** ### `get` : 获取value值 */
  get: <K extends keyof T>(key: K) => T[K]
}

class record<T extends RecordObject> implements Record<T> {
  readonly source: Immutable<T>

  constructor(source: T) {
    record_type_check(source)
    this.source = castImmutable(source) as Immutable<T>
  }

  /** ### `produce` : 对不可变数据做操作可变拷贝处理 */
  produce<R = void>(
    fn: (draft: Draft<T>) => R
  ): Result<Immut<R extends void ? T : R>, IllegalOperatError> {
    const res = immut_produce<T, R>(this.source, fn as any)
    if (res.is_err) return res as Result<never, IllegalOperatError>
    return Ok(Immut(res.unwrap())) as Result<Immut<R extends void ? T : R>, never>
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.safe()[key] as any as T[K]
  }

  safe(): Immutable<T> {
    return immer_proxy(this.source as T) as Immutable<T>
  }

  /**  ###  `eq` : 实现{@link PartialEq}接口 */
  eq(other: this): boolean {
    return equal(this.source, other.source)
  }

  as(flag: 'object'): T {
    /** @todo : deep_clone 进行深度克隆 */
    if (flag === 'object') return this.source as T
    throw new TypeError('Record.as() only support flag : object')
  }
}

export function Record<T extends RecordObject>(obj: T): Record<T> {
  return new record(obj) as Record<T>
}

/** ## `is_record` : 判断是否Record类型 */
function is_record(val: unknown): val is Record<any> {
  return val instanceof record
}

export { is_record, type RecordObject }

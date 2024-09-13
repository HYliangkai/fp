import { is_record, is_refer, ReadOnlyError, type Immutable } from '@chzky/fp'

/** 对数据做不可变数据代理 : 单数据进行修改或赋值行为的时候进行抛出`ReadOnlyError`异常
@excption `Refer` -- 如果数据源是Refer|Record|Tuple类型,则不进行代理
  */
export function immer_proxy<T extends object>(obj: T): Immutable<T> {
  return new Proxy(obj, {
    set(_, prop): boolean {
      throw ReadOnlyError.new(`'${String(prop)}'`)
    },

    get(target, prop): any {
      const value = Reflect.get(target, prop)
      /* base type return  */
      if (
        typeof value === 'symbol' ||
        typeof value === 'boolean' ||
        typeof value === 'number' ||
        typeof value === 'string' ||
        typeof value === 'undefined' ||
        typeof value === 'bigint' ||
        value === null
      )
        return value

      /* ref return */
      if (is_refer(value)) return value
      if (is_record(value)) return value
      /** @todo : tuple */

      /* ref type return  */
      if (typeof value === 'function' || typeof value === 'object') return immer_proxy(value)
    },

    defineProperty(): boolean {
      return false
    },

    deleteProperty(): boolean {
      return false
    },

    setPrototypeOf(): boolean {
      return false
    },
  }) as Immutable<T>
}

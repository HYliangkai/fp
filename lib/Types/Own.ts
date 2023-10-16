/** 
@deprecated 设计臃肿,废弃使用
Own<T>的类型推导:泛型单态化 */
export type Own<T> = T extends boolean
  ? OwnBoolean
  : T extends number
  ? OwnNumber
  : T extends Array<unknown>
  ? OwnArray<unknown>
  : OwnOther<T>

/** @array */
type OwnArray<T> = Omit<
  OwnOther<Array<T>> & {
    is_empty(): Own<boolean>
  },
  ''
>

/** @number */
type OwnNumber = Omit<
  OwnOther<number> & {
    is_nan(): Own<boolean>
  },
  ''
>

/** @boolean */
type OwnBoolean = Omit<
  OwnOther<boolean> & {
    /** 对true/false进行匹配但是只返回原来的OwnBoolean */
    match(true_handle?: () => void, false_handle?: () => void): Own<boolean>
    /** 对true/false进行匹配返回新值 */
    match_map<T>(true_handle: (val: true) => T, false_handle: (val: false) => T): Own<T>
    /** 匹配true */
    match_true: (fn: Function) => void
    /** 匹配false */
    match_false: (fn: Function) => void
  },
  ''
>

/** @all */
interface OwnOther<T> {
  readonly value: T
  /** 取值 */
  take(): T
  /** 是否数组 */
  is_array(): Own<boolean>
  /** 值处理 */
  map<V>(fn: (value: T) => V): Own<V>
  /**  全等处理 多个比较数据采用 and / or 形式  , 默认采用and形式*/
  is_match: (value: T | T[], and?: boolean) => Own<boolean>
}

export function Own<T>(value: T): Own<T> {
  /** @allCase */
  const own = {
    value,
    take: () => value,
    is_array: () => Own(Array.isArray(value)),
    map: (fn: (val: T) => unknown) => Own(fn(value)),
    is_match: (val: T, and = true) =>
      Array.isArray(val)
        ? and
          ? Own(val.every(v => v === value))
          : Own(val.some(v => v === value))
        : Own(val === value),
  }
  /** @ArrayCase */
  if (Array.isArray(value)) {
    //@ts-ignore
    return {
      ...own,
      is_empty: () => Own(value.length === 0),
    } as Own<unknown>
  } /** @BooleanCase */ else if (typeof value === 'boolean') {
    //@ts-ignore
    return {
      ...own,
      match: (t = () => {}, f = () => {}) => {
        value ? t() : f()
        return Own(value)
      },
      match_map: (t, f) => {
        return Own(value ? t(true) : f(false))
      },
      match_true(fn) {
        value ? fn() : ''
      },
      match_false(fn) {
        !value ? fn() : ''
      },
    }
  } /** @NumberCase */ else if (typeof value === 'number') {
    //@ts-ignore
    return {
      ...own,
      is_nan: () => Own(isNaN(value)),
    }
  } else return own as Own<T>
}

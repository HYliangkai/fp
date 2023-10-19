import {None, Option, Some} from '../../mod.ts'

const map = function* (flow: any, transform: any) {
  for (const data of flow) {
    yield transform(data)
  }
}

const filter = function* (flow: any, condition: any) {
  for (const data of flow) {
    if (condition(data)) {
      yield data
    }
  }
}

const take = function* (iterator: any, num: number) {
  let index = 0
  let data
  for (data of iterator) {
    if (index < num) {
      yield data
      index += 1
    } else {
      break
    }
  }
}

const value = <T>(iterator: any) => {
  const val: Array<T> = []

  for (const item of iterator) {
    val.push(item)
  }
  return val
}

const back_tag = Symbol('back')
const back = () => {
  throw back_tag
}
const for_each = <T>(iterator: any, callback: (val: T, backer: () => never) => any) => {
  try {
    for (const item of iterator) {
      callback(item, back)
    }
  } catch (effect) {
    if (effect != back_tag) throw effect
  }
}
const some = <T>(iterator: any, callback: (val: T) => boolean): boolean => {
  for (const item of iterator) {
    if (callback(item)) return true
  }
  return false
}

const find = <T>(iterator: any, callback: (val: T) => boolean): Option<T> => {
  for (const item of iterator) {
    if (callback(item)) return Some(item)
  }
  return None
}

const at = <T>(iterator: any, index: number): Option<T> => {
  let i = 0
  for (const item of iterator) {
    if (i === index) return Some(item)
    else i += 1
  }
  return None
}

const slice = function* (iterator: any, start: number, end?: number) {
  let index = 0
  if (end === undefined) {
    for (const item of iterator) {
      if (start >= index) {
        yield item
      }
      index++
    }
  } else {
    for (const item of iterator) {
      if (start >= index && end < index) {
        yield item
      }
      index++
    }
  }
}

const range = function* (iterator: any, range: number, fill = None) {
  let index = 0

  for (const item of iterator) {
    yield item
    index += 1
  }
  while (index < range) {
    yield fill
    index += 1
  }
}

export function Lazy_Array<T>(val?: Array<T>) {
  return new LazyArray<T>(val)
}

/**
  ## LazyArray : 一个提供惰性求值的数组
  **tips* : 当前还是测试版本,在不用take()取值的情况下性能是不如JS内建的Array的,所以请在明确需要使用take()进行范围取值的情况下使用LazyArray
 */
export class LazyArray<T> {
  private _iterator: any
  constructor(iterator?: any) {
    this._iterator = iterator || []
  }

  public for_each(callback: (val: T, back: () => never) => any): void {
    for_each(this._iterator, callback)
  }

  public map<V>(callback: (val: T) => V) {
    this._iterator = map(this._iterator, callback)
    return this as unknown as LazyArray<V>
  }

  public filter(callback: (val: T) => boolean) {
    this._iterator = filter(this._iterator, callback)
    return this
  }

  /** 🌟: 性能关键 */
  public take(range: number) {
    this._iterator = take(this._iterator, range)
    return this
  }

  public slice(start: number, end?: number) {
    this._iterator = slice(this._iterator, start, end)
    return this
  }

  public find(callback: (val: T) => boolean): Option<T> {
    return find(this._iterator, callback)
  }

  public value() {
    return value<T>(this._iterator)
  }

  public some(callback: (val: T) => boolean): boolean {
    return some(this._iterator, callback)
  }

  public exec<V>(callback: (val: Array<T>) => V) {
    return callback(this.value())
  }

  public at(index: number): Option<T> {
    return at(this._iterator, index)
  }

  public range(rang: number, fill = None): LazyArray<T | typeof fill> {
    this._iterator = range(this._iterator, rang, fill)
    //@ts-ignore
    return this
  }

  static of<T>(val: Array<T>) {
    return new LazyArray<T>(val)
  }

  static from<T, V>(val: ArrayLike<T>, mapback?: (val: T) => V) {
    if (mapback) {
      const array = []
      for (var i = 0, len = val.length; i < len; i++) {
        array.push(mapback(val[i]))
      }
      return new LazyArray<V>(array)
    } else {
      return new LazyArray<T>(Array.prototype.slice.call(val))
    }
  }

  //@ts-ignore
  static is_lazy_array<V>(val: V): val is LazyArray<V> {
    return val instanceof LazyArray
  }

  public entries() {
    return this._iterator
  }

  [Symbol.iterator]() {
    return this._iterator
  }
}

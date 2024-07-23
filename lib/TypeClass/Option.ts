import {
  type Fns,
  type Default,
  type AnyResult,
  type ErrorLevel,
  panic,
  some_tag,
  none_tag,
  NotImplementsError,
  Ok,
  NoneError,
  Err,
} from '../../mod.ts'

/** ## Option : 一个可能为{@link None}或{@link Some}的数据类型
  @category TypeClass */
export type Option<T> = Some<NonNullable<T>> | None

/** ## AsyncOption : 对 {@link Option}的异步封装
  @category TypeClass */
export type AsyncOption<T> = Promise<Option<T>>

export interface opt<T> {
  readonly _tag: typeof some_tag | typeof none_tag
  /** 是否为Some*/
  readonly is_some: boolean
  /** 是否为None */
  readonly is_none: boolean
  /**  获取值,如果为None就抛异 */
  unwarp(level?: ErrorLevel): T
  /** 抛异,如果为None就抛异,msg作为错误信息 */
  expect(msg: string): T
  /** 如果为some就执行 */
  some_do(fn: (val: T) => void): void
}
interface Some<T> extends opt<T> {
  readonly _tag: typeof some_tag
  readonly value: T
  unwrap_or(def: T): T
  unwrap_or_else(fn: () => T): T
  unwrap_or_default<X, U extends Default<X>>(value: U): T
  map<V>(callback: (value: T) => V): Option<V>
  and_then<V>(callback: (value: T) => Option<V>): Option<V>
  to_result(): AnyResult<T>
}
interface None extends opt<never> {
  readonly _tag: typeof none_tag
  /** 如果为None使用def作为默认值插入 */
  unwrap_or<V>(def: V): V
  /** 如果为None使用fn()作为默认值插入 */
  unwrap_or_else<V>(fn: () => V): V
  /** 传入实现了{@link Default}接口的数据,如果结果为none使用default值替代 */
  unwrap_or_default<X, U extends Default<X>>(value: U): X
  /** 如果为Some调用callback结果替换Some值 */
  map<V>(callback: (value: never) => Option<V>): Option<V>
  /** 如果为Some调用callback进行替换 */
  and_then<V>(callback: (value: never) => Option<V>): Option<V>
  /** 转化为Result类型 */
  to_result(): AnyResult<never>
}

class some<T> implements Some<T> {
  value: T
  constructor(val: T) {
    this.value = val
    this._tag = some_tag
    this.is_some = true
    this.is_none = false
  }
  _tag: typeof some_tag
  readonly is_some: boolean
  readonly is_none: boolean
  unwarp(_level?: ErrorLevel): T {
    return this.value
  }
  expect(_msg: string): T {
    return this.value
  }
  unwrap_or<V>(_def: V): T {
    return this.value
  }
  unwrap_or_else(_fn: Fns<unknown>): T {
    return this.value
  }
  unwrap_or_default<U extends Default<unknown>>(_value: U): T {
    return this.value
  }
  map<V>(callback: (value: T) => NonNullable<V>): Option<V> {
    return Some(callback(this.value))
  }
  some_do(fn: Fns<unknown>): void {
    fn(this.value)
  }
  and_then<V>(callback: (value: T) => Option<V>): Option<V> {
    return callback(this.value)
  }
  to_result(): AnyResult<T> {
    return Ok(this.value)
  }
}

/** ## Some
  + 将一个值转化为Some类型
  + 如果值为null/underfind 就抛出异常
  + 如果值为其他类型就转化为Some类型
  @throws  AnyError<'Error','Some Value'>
  @category TypeClass
 */
export function Some<T>(val: NonNullable<T>): Option<T> {
  if (val === undefined || val === null) panic('Error', 'Some Value')
  return new some(val)
}

export const None: None = {
  _tag: none_tag,
  is_some: false,
  is_none: true,
  unwarp(level?: ErrorLevel): never {
    panic(level || 'Error', 'None Value')
  },
  expect(msg: string, level?: ErrorLevel): never {
    panic(level || 'Error', msg)
  },
  unwrap_or<T>(def: T): T {
    return def
  },
  unwrap_or_else<V>(fn: () => V): V {
    return fn()
  },
  unwrap_or_default<X, U extends Default<X>>(value: U): X {
    if (typeof value === 'object' && typeof value['default'] === 'function') {
      return value['default']()
    } else {
      throw new NotImplementsError('Default')
    }
  },
  map<V>(_callback: (value: V) => V): Option<V> {
    return this
  },
  some_do(_fn): void {},
  and_then<V>(_callback: (value: V) => Option<V>): Option<V> {
    return this
  },
  to_result(): AnyResult<never> {
    return Err(NoneError.new())
  },
}

/** ## option : 将任意类型转化为Option类型(浅遍历)
  + null | underfind ->`None`
  + other ->`Some<other>`
  @example
  ```ts
  const a = option(1)
  assertEquals(a.is_some, true)
  const b = option(null)
  assertEquals(b.is_none, true)
  ```
  @category TypeClass
*/
export function option<T>(value: T): Option<T> {
  return value === undefined || value === null ? None : (Some(value) as Option<T>)
}

import { type Option, None, Some } from '../../../mod.ts'

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

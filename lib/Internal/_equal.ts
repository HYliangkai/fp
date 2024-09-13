/** ### `equal` : 深度判断两个数据是否相同
@example Uasge
```ts
  const o1 = { name: 'jiojio', age: 18 }
  const o2 = { name: 'jiojio', age: 18 }
  assert(equal(o1, o2))

  const a4 = [1, NaN, { name: 'jiojio' }, 'dio']
  const a5 = [1, NaN, { name: 'jiojio' }, 'dio']
  assert(equal(a4, a5))

  const a6 = [1, NaN, { name: 'jiojio' }, 'jiojio']
  assert_reverse(equal(a4, a6))
```
@category Data
 */
export function equal(actual: unknown, expected: unknown): boolean {
  const seen = new Map()

  function compare(a: unknown, b: unknown): boolean {
    /* RegExp | URL */
    if ((a instanceof RegExp && b instanceof RegExp) || (a instanceof URL && b instanceof URL))
      return String(a) === String(b)

    /* Date */
    if (a instanceof Date && b instanceof Date)
      return a.getTime() === b.getTime() || (Number.isNaN(a.getTime()) && Number.isNaN(b.getTime()))

    /* number */
    if (typeof a === 'number' && typeof b === 'number')
      return a === b || (Number.isNaN(a) && Number.isNaN(b))

    /* Object.is() */
    if (Object.is(a, b)) return true

    /** @Object */
    if (a === null || b === null) return false
    if (typeof a !== 'object' || typeof b !== 'object') return false

    /* constructor --> 构造函数同等性判断 */
    if (!constructor_equal(a, b)) return false

    /* exclude WeakMap | WeakSet | WeakRef */
    if (a instanceof WeakMap || a instanceof WeakSet) return false
    if (b instanceof WeakMap || b instanceof WeakSet) return false

    /** mark value */
    if (seen.has(a)) return seen.get(a) === b // 重复出现的对象

    /* length */
    if (Object.keys(a).length !== Object.keys(b).length) return false

    /* set value */
    seen.set(a, b)

    /** @SetMap */
    if (is_map_or_set(a) && is_map_or_set(b)) {
      let unmatched_entries = a.size
      if (a.size !== b.size) return false
      for (const [ak, av] of a.entries()) {
        for (const [bk, bv] of b.entries()) {
          /* set | map */
          if ((ak === av && bk === bv && compare(av, bv)) || (compare(ak, bk) && compare(av, bv))) {
            unmatched_entries--
            break
          }
        }
      }
      return unmatched_entries === 0
    }

    /* loop equal */
    const merged = { ...a, ...b }
    for (const key of [
      ...Object.getOwnPropertyNames(merged),
      ...Object.getOwnPropertySymbols(merged),
    ]) {
      type Key = keyof typeof merged
      /* key in */
      if (!(key in a) || !(key in b)) return false

      /* key compare */
      if (!compare(a && a[key as Key], b && b[key as Key])) return false
    }
    return true

    /* key in a yet key in b */
  }

  return compare(actual, expected)
}

function is_map_or_set(x: unknown): x is Map<unknown, unknown> | Set<unknown> {
  return [Symbol.iterator, 'size'].every((k) => k in (x as Set<unknown>))
}

function constructor_equal(a: object, b: object): boolean {
  return (
    a.constructor === b.constructor ||
    (a.constructor === Object && !b.constructor) ||
    (!a.constructor && b.constructor === Object)
  )
}

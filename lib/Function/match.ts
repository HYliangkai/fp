import {Condition, Def, JudeCondition} from './mod.ts'

/**
## match : Simple Pattern matching
简单的模式匹配
### Example
+ normal match
```typescript
const name='jiojio'
const age=match(name,
['jiojio',18],
[(name)=>name==='dio',19],
[Def,20])
assert(age===18)//true
```
+ match with implements the interface : PartialEq
```typescript
class User implements PartialEq {
  constructor(public name: string, public age: number) {}

  eq(other: this) {
    return other.name == this.name && other.age == this.age
  }
}
const User1 = new User('Tom', 18)
const User2 = new User('Tom', 18)
const res = match(User1, [User2, true], [Def, false])
assert(res)//true

```
*/
export function match<T, V>(match_value: T, ab: [typeof Def, V]): V
export function match<T, V, C>(match_value: T, ab: [Condition<T>, V], bc: [typeof Def, C]): V | C
export function match<T, V, C, D>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [typeof Def, D]
): V | C | D
export function match<T, V, C, D, F>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [typeof Def, F]
): V | C | D | F

export function match<T, V, C, D, F, G>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [typeof Def, G]
): V | C | D | F | G

export function match<T, V, C, D, F, G, H>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [typeof Def, H]
): V | C | D | F | G | H

export function match<T, V, C, D, F, G, H, I>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [Condition<T>, H],
  gh: [typeof Def, I]
): V | C | D | F | G | H | I

export function match<T, V, C, D, F, G, H, I, J>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [Condition<T>, H],
  gh: [Condition<T>, I],
  hi: [typeof Def, J]
): V | C | D | F | G | H | I | J

export function match<T, V, C, D, F, G, H, I, J, K>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [Condition<T>, H],
  gh: [Condition<T>, I],
  hi: [Condition<T>, J],
  ij: [typeof Def, K]
): V | C | D | F | G | H | I | J | K

export function match<T, V, C, D, F, G, H, I, J, K, L>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [Condition<T>, H],
  gh: [Condition<T>, I],
  hi: [Condition<T>, J],
  ij: [Condition<T>, K],
  jk: [typeof Def, L]
): V | C | D | F | G | H | I | J | K | L
export function match(
  match_value: any,
  ...args: ([Condition<any>, unknown] | [typeof Def, unknown])[]
): any {
  for (const index in args) {
    const [condition, result] = args[index]
    if (condition === match_value) {
      return result
    } else if (typeof condition === 'function' && (condition as JudeCondition<any>)(match_value)) {
      return result
    } else if (typeof match_value['eq'] === 'function' && typeof condition['eq'] === 'function') {
      if (match_value['eq'](condition)) {
        return result
      }
    } else if (condition === Def) {
      return result
    }
  }
}

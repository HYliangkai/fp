import {Condition, Def, JudeCondition} from './mod.ts'
/** pattern : Corey form of match function
### Example
```ts
const name='jiojio'
const age=pattern(
['jiojio',18],
[(name)=>name==='dio',19],
[Def,20])
assert(age(name)===18)//true
```

  */
export function pattern<T, V>(ab: [typeof Def, V]): (value: V) => V
export function pattern<T, V, C>(ab: [Condition<T>, V], bc: [typeof Def, C]): (value: V) => V | C
export function pattern<T, V, C, D>(
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [typeof Def, D]
): (value: V) => V | C | D
export function pattern<T, V, C, D, F>(
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [typeof Def, F]
): (value: V) => V | C | D | F

export function pattern<T, V, C, D, F, G>(
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [typeof Def, G]
): (value: V) => V | C | D | F | G

export function pattern<T, V, C, D, F, G, H>(
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [typeof Def, H]
): (value: V) => V | C | D | F | G | H

export function pattern<T, V, C, D, F, G, H, I>(
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [Condition<T>, H],
  gh: [typeof Def, I]
): (value: V) => V | C | D | F | G | H | I

export function pattern<T, V, C, D, F, G, H, I, J>(
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [Condition<T>, H],
  gh: [Condition<T>, I],
  hi: [typeof Def, J]
): (value: V) => V | C | D | F | G | H | I | J

export function pattern<T, V, C, D, F, G, H, I, J, K>(
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [Condition<T>, H],
  gh: [Condition<T>, I],
  hi: [Condition<T>, J],
  ij: [typeof Def, K]
): (value: V) => V | C | D | F | G | H | I | J | K

export function pattern<T, V, C, D, F, G, H, I, J, K, L>(
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
): (value: V) => V | C | D | F | G | H | I | J | K | L
export function pattern(...args: ([Condition<any>, unknown] | [typeof Def, unknown])[]): any {
  return (pattern_value: any) => {
    for (const index in args) {
      const [condition, result] = args[index]
      if (condition === pattern_value) {
        return result
      } else if (
        typeof condition === 'function' &&
        (condition as JudeCondition<any>)(pattern_value)
      ) {
        return result
      } else if (condition === Def) {
        return result
      }
    }
  }
}

/**
Simple Pattern matching
## Example
```typescript
const name='jiojio'
const age=match(name,
['jiojio',18],
[(name)=>name==='dio',19],
[Default,20])
assert(age===18)//true

```
*/
export function match<T, V>(match_value: T, ab: [typeof Default, V]): V
export function match<T, V, C>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [typeof Default, C],
): V | C
export function match<T, V, C, D>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [typeof Default, D],
): V | C | D
export function match<T, V, C, D, F>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [typeof Default, F],
): V | C | D | F

export function match<T, V, C, D, F, G>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [typeof Default, G],
): V | C | D | F | G

export function match<T, V, C, D, F, G, H>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [typeof Default, H],
): V | C | D | F | G | H

export function match<T, V, C, D, F, G, H, I>(
  match_value: T,
  ab: [Condition<T>, V],
  bc: [Condition<T>, C],
  cd: [Condition<T>, D],
  de: [Condition<T>, F],
  ef: [Condition<T>, G],
  fg: [Condition<T>, H],
  gh: [typeof Default, I],
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
  hi: [typeof Default, J],
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
  ij: [typeof Default, K],
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
  jk: [typeof Default, L],
): V | C | D | F | G | H | I | J | K | L
export function match(
  match_value: any,
  ...args: ([Condition<any>, unknown] | [typeof Default, unknown])[]
): any {
  for (const index in args) {
    const [condition, result] = args[index]
    if (condition === match_value) {
      return result
    } else if (
      typeof condition === 'function' &&
      (condition as JudeCondition<any>)(match_value)
    ) {
      return result
    } else if (condition === Default) {
      return result
    }
  }
}
/** ## Default
global default value
*/
export const Default = Symbol('default')
type JudeCondition<T> = (val: T) => boolean
type Condition<T> = T | JudeCondition<T>

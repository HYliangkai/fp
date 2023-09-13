/**
Simple Pattern matching
## Example
```typescript
const name='jiojio'
const age=match(name,
['jiojio',18],
[(name)=>name==='dio',19],
['default',20])
assert(age===18)//true

```
*/
export function match<T>(
  match_value: T,
  ab: [Condition<T>, unknown],
  bc: [typeof Default, unknown],
): unknown
export function match<T>(
  match_value: T,
  ab: [Condition<T>, unknown],
  bc: [Condition<T>, unknown],
  cd: [typeof Default, unknown],
): unknown
export function match<T>(
  match_value: T,
  ab: [Condition<T>, unknown],
  bc: [Condition<T>, unknown],
  cd: [Condition<T>, unknown],
  de: [typeof Default, unknown],
): unknown
export function match<T>(
  match_value: T,
  ab: [Condition<T>, unknown],
  bc: [Condition<T>, unknown],
  cd: [Condition<T>, unknown],
  de: [Condition<T>, unknown],
  ef: [typeof Default, unknown],
): unknown
export function match<T>(
  match_value: T,
  ab: [Condition<T>, unknown],
  bc: [Condition<T>, unknown],
  cd: [Condition<T>, unknown],
  de: [Condition<T>, unknown],
  ef: [Condition<T>, unknown],
  fg: [typeof Default, unknown],
): unknown
export function match<T>(
  match_value: T,
  ab: [Condition<T>, unknown],
  bc: [Condition<T>, unknown],
  cd: [Condition<T>, unknown],
  de: [Condition<T>, unknown],
  ef: [Condition<T>, unknown],
  fg: [Condition<T>, unknown],
  gh: [typeof Default, unknown],
): unknown
export function match<T>(
  match_value: T,
  ab: [Condition<T>, unknown],
  bc: [Condition<T>, unknown],
  cd: [Condition<T>, unknown],
  de: [Condition<T>, unknown],
  ef: [Condition<T>, unknown],
  fg: [Condition<T>, unknown],
  gh: [Condition<T>, unknown],
  hi: [typeof Default, unknown],
): unknown
export function match<T>(
  match_value: T,
  ab: [Condition<T>, unknown],
  bc: [Condition<T>, unknown],
  cd: [Condition<T>, unknown],
  de: [Condition<T>, unknown],
  ef: [Condition<T>, unknown],
  fg: [Condition<T>, unknown],
  gh: [Condition<T>, unknown],
  hi: [Condition<T>, unknown],
  ij: [typeof Default, unknown],
): unknown
export function match<T>(
  match_value: T,
  ab: [Condition<T>, unknown],
  bc: [Condition<T>, unknown],
  cd: [Condition<T>, unknown],
  de: [Condition<T>, unknown],
  ef: [Condition<T>, unknown],
  fg: [Condition<T>, unknown],
  gh: [Condition<T>, unknown],
  hi: [Condition<T>, unknown],
  ij: [Condition<T>, unknown],
  jk: [typeof Default, unknown],
): unknown
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
export const Default = Symbol('default')
type JudeCondition<T> = (val: T) => boolean
type Condition<T> = T | JudeCondition<T>

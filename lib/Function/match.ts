type JudeCondition<T> = (val: T) => boolean
type Condition<T> = T | JudeCondition<T>
/**
Use typescript to Pattern matching
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
export const match = <T>(
  match_value: T,
  ...args: [...[Condition<T>, unknown][], ['default', unknown]]
) => {
  for (const index in args) {
    const [condition, result] = args[index]
    if (condition === match_value) {
      return result
    } else if (
      typeof condition === 'function' &&
      (condition as JudeCondition<T>)(match_value)
    ) {
      return result
    } else if (Number(index) === args.length - 1 && condition === 'default') {
      return result // 确保最后一项是default
    }
  }
}

import {type Option, option} from '../../mod.ts'

/** ## value : 获取obj[key]值 ,相当于 {@link option}(value[key])
@example
```ts
const obj={name:'jiojio'}
const name=value(obj,'name')
assert(name.is_some)//true

const name=value(obj,'age')
assert(name.is_none)//true
```
@category Function
*/
export function value<T, K extends keyof T>(
  val: T,
  key: K
): Option<T[K] extends null | undefined ? never : T[K]> {
  return option(val[key]) as Option<any>
}

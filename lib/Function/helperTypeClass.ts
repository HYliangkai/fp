import {Option} from '../../mod.ts'

/** ## filter_option : Option类型转化成boolean
  + `Some(any)` --> `true`
  + `None` --> `false`
@example
```ts
const V = [Some(1),None,Some(2),None]
const res = V.filter(filter_option)
assert(res.every(i=>i.is_some))
```
@category Function
*/
export const filter_option = (inp: Option<unknown>): boolean => inp.is_some

/** ## unwarp_option : Option.unwarp()的函数化
  + `unwarp_option(Some(any))` == `Some(any).unwarp()`
@example
```ts
const V = [Some(1),None,Some(2),None]
const res = V.filter(filter_option).map(unwarp_option)
assertEquals(res,[1,2])
```
@category Function
*/
export const unwarp_option = (inp: Option<unknown>) => inp.unwarp()

/** ## unwarp_options : 将可迭代的Option<T>转化为T[]
  + `unwarp_option_array([Some(any),None,Some(any)])` == `[Some(any).unwarp(),Some(any).unwarp()]`
@example
```ts
const V = [Some(1),None,Some(2),None]
const res = unwarp_option_array(V)
assertEquals(res,[1,2])
```
@category Function
*/
export const unwarp_iter_options = <T>(inp: Iterable<Option<T>>): Array<T> => {
  const res: T[] = []
  for (const item of inp) {
    item.is_some ? res.push(item.unwarp()) : null
  }
  return res
}

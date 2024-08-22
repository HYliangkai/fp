import type { AnyFunc, Fn } from '@chzky/fp'

type FuncRemainArgs<T extends object, K extends keyof T> = T[K] extends (...args: infer P) => any
  ? P
  : never[]

type FuncReturnType<T extends object, K extends keyof T> = T[K] extends (...args: any) => infer P
  ? P
  : T[K]

/** ## reversal : 将 `链式调用` 转置为 `函数调用` 
@example Uasge
```ts
  const some: Option<boolean> = Some(true)

  //在match中使用
  const mres = match(some)
    .case(reversal('as', 'boolean'), true) // like :  case((val)=>val.as(),true)
    .done(false)
  assert(mres)

  //在pipe中使用
  const pres = pipe(true, Some, reversal('unwrap'))
  assert(pres)

  //取值
  const nres = pipe(None, reversal('is_none')) // like : None.is_none
  assert(nres)
```
@category Function
*/
export function reversal<T extends object, K extends keyof T = keyof T>(
  key: K,
  ...args: FuncRemainArgs<T, K>
): Fn<T, FuncReturnType<T, K>> {
  return (target: T): FuncReturnType<T, K> => {
    if (typeof target[key] === 'function') return (target[key] as AnyFunc)(...args)
    else if (typeof target[key] !== 'undefined') return target[key] as FuncReturnType<T, K>
    throw new TypeError(`doesn't exist ${String(key)} in ${target}`)
  }
}

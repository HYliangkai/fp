import { zod } from '@chzky/fp'

/** ## Copy : 提供一个自定义克隆接口,`深度遍历`
* - clone():Copy 
@example
```ts
class A implements Copy{
  constructor(public a:number){}
  clone(){ return new A(this.a) }
}
let a=new A(1)
let b=a.clone(
assert(a.a==b.a)
assert(a!=b)
```
@category Interface
*/
export interface Copy {
  readonly clone: () => Copy
}

/** ## `implements_copy` : duck type to judge Copy type @category Interface */
export function implements_copy(value: unknown): value is Copy {
  return zod.object({ clone: zod.function() }).safeParse(value).success
}

/** ## Copy : 提供一个自定义克隆接口,`深度遍历`
* - clone():this 
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
  readonly clone: () => this
}

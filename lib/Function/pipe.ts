type Fn<A, B> = (a: A) => B
/** ## pipe : Run the functions nested in parallel
### Example
```ts
console.log(pipe(
  1,//1
  (x: number) => x + 1,//2
  (x: number) => x * 2,//4
  (x: number) => x + 1,//5
)) // 5
```
*/
export function pipe<A>(a: A): A
export function pipe<A, B>(a: A, ab: Fn<A, B>): B
export function pipe<A, B, C>(a: A, ab: Fn<A, B>, bc: Fn<B, C>): C
export function pipe<A, B, C, D>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>): D
export function pipe<A, B, C, D, E>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>, de: Fn<D, E>): E
export function pipe<A, B, C, D, E, F>(
  a: A,
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>
): F
export function pipe<A, B, C, D, E, F, G>(
  a: A,
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>,
  fg: Fn<F, G>
): G
export function pipe<A, B, C, D, E, F, G, H>(
  a: A,
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>,
  fg: Fn<F, G>,
  gh: Fn<G, H>
): H
export function pipe<A, B, C, D, E, F, G, H, I>(
  a: A,
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>,
  fg: Fn<F, G>,
  gh: Fn<G, H>,
  hi: Fn<H, I>
): I
// 依此类推，根据需要添加更多的重载签名(手动)

//使用 any版本做函数的具体实现
export function pipe(...fns: Array<Fn<any, any>>): any {
  let ret = fns[0]
  for (let i = 1; i < fns.length; i++) {
    ret = fns[i](ret)
  }
  return ret
}

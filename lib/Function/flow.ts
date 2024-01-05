type Fn<A, B> = (a: A) => B

/** ##  flow : Corey form of pipe function
@example
```ts
const fn = flow(
  (x: number) => x + 1,
  (x: number) => x * 2,
  (x: number) => x + 1,
)
console.log(fn(1)) // 5
```
@category Function
*/
export function flow<A, B>(ab: Fn<A, B>): Fn<A, B>
export function flow<A, B, C>(ab: Fn<A, B>, bc: Fn<B, C>): Fn<A, C>
export function flow<A, B, C, D>(ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>): Fn<A, D>
export function flow<A, B, C, D, E>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>
): Fn<A, E>
export function flow<A, B, C, D, E, F>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>
): Fn<A, F>
export function flow<A, B, C, D, E, F, G>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>,
  fg: Fn<F, G>
): Fn<A, G>
export function flow<A, B, C, D, E, F, G, H>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>,
  fg: Fn<F, G>,
  gh: Fn<G, H>
): Fn<A, H>
export function flow<A, B, C, D, E, F, G, H, I>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>,
  fg: Fn<F, G>,
  gh: Fn<G, H>,
  hi: Fn<H, I>
): Fn<A, I>

export function flow(...fns: Array<Fn<any, any>>) {
  return function (x: any) {
    return fns.reduce((acc, fn) => fn(acc), x)
  }
}

type Fn<A, B> = (a: A) => B
/** ## lzpipe : Run the functions nested in parallel,but lazy run 
@example
```ts
const run = lzpipe(
  1,//1
  (x: number) => x + 1,//2
  (x: number) => x * 2,//4
  (x: number) => x + 1,//5
)
console.log(run()) // 5
```
@category Function
 */
export function lzpipe<A>(a: A): () => A
export function lzpipe<A, B>(a: A, ab: Fn<A, B>): () => B
export function lzpipe<A, B, C>(a: A, ab: Fn<A, B>, bc: Fn<B, C>): () => C
export function lzpipe<A, B, C, D>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>): () => D

export function lzpipe<A, B, C, D, E>(
  a: A,
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>
): () => E
export function lzpipe<A, B, C, D, E, F>(
  a: A,
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>
): () => F
export function lzpipe<A, B, C, D, E, F, G>(
  a: A,
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>,
  fg: Fn<F, G>
): () => G
export function lzpipe<A, B, C, D, E, F, G, H>(
  a: A,
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>,
  fg: Fn<F, G>,
  gh: Fn<G, H>
): () => H
export function lzpipe<A, B, C, D, E, F, G, H, I>(
  a: A,
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>,
  ef: Fn<E, F>,
  fg: Fn<F, G>,
  gh: Fn<G, H>,
  hi: Fn<H, I>
): () => I

export function lzpipe(...fns: Array<Fn<any, any>>): any {
  return () => {
    let ret = fns[0]
    for (let i = 1; i < fns.length; i++) {
      ret = fns[i](ret)
    }
    return ret
  }
}

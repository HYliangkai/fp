type PFn<A, B> = (a: A extends Promise<infer U> ? U : A) => B
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
export function lzpipe<A, B>(a: A, ab: PFn<A, B>): () => B
export function lzpipe<A, B, C>(a: A, ab: PFn<A, B>, bc: PFn<B, C>): () => C
export function lzpipe<A, B, C, D>(a: A, ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>): () => D

export function lzpipe<A, B, C, D, E>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>
): () => E
export function lzpipe<A, B, C, D, E, F>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>
): () => F
export function lzpipe<A, B, C, D, E, F, G>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>
): () => G
export function lzpipe<A, B, C, D, E, F, G, H>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>,
  gh: PFn<G, H>
): () => H
export function lzpipe<A, B, C, D, E, F, G, H, I>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>,
  gh: PFn<G, H>,
  hi: PFn<H, I>
): () => I

export function lzpipe(...fns: Array<PFn<any, any>>) {
  return async () => {
    let ret = fns[0]
    for (let i = 1; i < fns.length; i++) {
      ret = await fns[i](ret)
    }
    return ret
  }
}

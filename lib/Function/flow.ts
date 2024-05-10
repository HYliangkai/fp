type PFn<A, B> = (a: A extends Promise<infer U> ? U : A) => B

/** ##  flow : Corey form of pipe function
@example
```ts
const fn = flow(
  (x: number) => x + 1,
  (x: number) => x * 2,
  async (x: number) => x + 1,
)
assert(await fn(1) === 5)
```
@category Function
*/
export function flow<A, B>(ab: PFn<A, B>): PFn<A, B>
export function flow<A, B, C>(ab: PFn<A, B>, bc: PFn<B, C>): PFn<A, C>
export function flow<A, B, C, D>(ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>): PFn<A, D>
export function flow<A, B, C, D, E>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>
): PFn<A, E>
export function flow<A, B, C, D, E, F>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>
): PFn<A, F>
export function flow<A, B, C, D, E, F, G>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>
): PFn<A, G>
export function flow<A, B, C, D, E, F, G, H>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>,
  gh: PFn<G, H>
): PFn<A, H>
export function flow<A, B, C, D, E, F, G, H, I>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>,
  gh: PFn<G, H>,
  hi: PFn<H, I>
): PFn<A, I>

export function flow(...fns: Array<PFn<any, any>>) {
  return async function (x: any) {
    let ret = x
    for (let i = 0; i < fns.length - 1; i++) {
      ret = await fns[i](ret)
    }
    return ret
  }
}

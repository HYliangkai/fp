import {pipe} from './mod.ts'

type PFn<A, B> = (a: A extends Promise<infer U> ? U : A) => B
type PromiseLine<A, B> = A extends Promise<any>
  ? Promise<any>
  : B extends Promise<any>
  ? Promise<any>
  : B

/** ## PipeResult<A<B> : if A or B is Promise,return Promise ; else return NoPromise  */
type PipeResult<A, B> = A extends Promise<any> ? A : B extends Promise<any> ? Promise<A> : A

/** ## lzpipe : 惰性pipe,返回一个函数执行{@link pipe}
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
export function lzpipe<A, B>(a: A, ab: PFn<A, B>): () => PipeResult<B, A>
export function lzpipe<A, B, C>(a: A, ab: PFn<A, B>, bc: PFn<B, C>): () => PipeResult<C, B>
export function lzpipe<A, B, C, D>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>
): () => PipeResult<D, PromiseLine<C, B>>

export function lzpipe<A, B, C, D, E>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>
): () => PipeResult<E, PromiseLine<D, PromiseLine<C, B>>>
export function lzpipe<A, B, C, D, E, F>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>
): () => PipeResult<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>
export function lzpipe<A, B, C, D, E, F, G>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>
): () => PipeResult<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
export function lzpipe<A, B, C, D, E, F, G, H>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>,
  gh: PFn<G, H>
): () => PipeResult<
  H,
  PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
>
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
): () => PromiseLine<
  H,
  PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
>

export function lzpipe(...fns: Array<PFn<any, any>>) {
  //@ts-ignore : 参数缺省
  return () => pipe(...fns)
}

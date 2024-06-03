import {pipe} from './mod.ts'

type PFn<A, B> = (a: A extends Promise<infer U> ? U : A) => B

type PromiseLine<A, B> = A extends Promise<any>
  ? Promise<any>
  : B extends Promise<any>
  ? Promise<any>
  : B

/** ## PipeResult<A<B> : if A or B is Promise,return Promise ; else return NoPromise  */
type FlowResult<T, A, B> = (
  a: T
) => A extends Promise<any> ? A : B extends Promise<any> ? Promise<A> : A

/** ##  flow : {@link pipe}函数的科里化版本
@example
```ts
const fn = flow(
  (x: number) => x + 1,
  (x: number) => x * 2,
  async (x: number) => x + 1,
)
// You don't need 'await' in  Process function
assert(await fn(1) === 5)
```
@category Function
*/
export function flow<A, B>(ab: PFn<A, B>): FlowResult<A, B, A>
export function flow<A, B, C>(ab: PFn<A, B>, bc: PFn<B, C>): FlowResult<A, C, B>
export function flow<A, B, C, D>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>
): FlowResult<A, D, PromiseLine<C, B>>
export function flow<A, B, C, D, E>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>
): FlowResult<A, E, PromiseLine<D, PromiseLine<C, B>>>
export function flow<A, B, C, D, E, F>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>
): FlowResult<A, F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>
export function flow<A, B, C, D, E, F, G>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>
): FlowResult<A, G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
export function flow<A, B, C, D, E, F, G, H>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>,
  gh: PFn<G, H>
): FlowResult<
  A,
  H,
  PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
>
export function flow<A, B, C, D, E, F, G, H, I>(
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>,
  gh: PFn<G, H>,
  hi: PFn<H, I>
): FlowResult<
  A,
  I,
  PromiseLine<H, PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>>
>

export function flow(...fns: Array<PFn<any, any>>) {
  //@ts-ignore : 参数缺省
  return (x: any) => pipe(x, ...fns)
}

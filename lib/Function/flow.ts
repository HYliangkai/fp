import { FlowResult, FlowReturn, PFn, PromiseLine, pipe, FlowPromiseChange, Fn, is_async_func } from '../../mod.ts'

interface AutoFlow {
  /** ## FLow : pipe的科里化版本 */
  <A, B>(ab: PFn<A, B>): FlowResult<A, B, A>
  <A, B, C>(ab: PFn<A, B>, bc: PFn<B, C>): FlowResult<A, C, B>
  <A, B, C, D>(ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>): FlowResult<A, D, PromiseLine<C, B>>
  <A, B, C, D, E>(ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>, de: PFn<D, E>): FlowResult<
    A,
    E,
    PromiseLine<D, PromiseLine<C, B>>
  >
  <A, B, C, D, E, F>(ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>, de: PFn<D, E>, ef: PFn<E, F>): FlowResult<
    A,
    F,
    PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>
  >
  <A, B, C, D, E, F, G>(
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>
  ): FlowResult<A, G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
  <A, B, C, D, E, F, G, H>(
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>,
    gh: PFn<G, H>
  ): FlowResult<A, H, PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>>
  <A, B, C, D, E, F, G, H, I>(
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>,
    gh: PFn<G, H>,
    hi: PFn<H, I>
  ): FlowResult<A, I, PromiseLine<H, PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>>>
  (...fns: Array<PFn<any, any>>): (a: unknown) => unknown
}

interface SyncFlow {
  <A, B>(ab: Fn<A, B>): FlowReturn<A, B>
  <A, B, C>(ab: Fn<A, B>, bc: Fn<B, C>): FlowReturn<A, C>
  <A, B, C, D>(ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>): FlowReturn<A, D>
  <A, B, C, D, E>(ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>, de: Fn<D, E>): FlowReturn<A, E>
  <A, B, C, D, E, F>(ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>, de: Fn<D, E>, ef: Fn<E, F>): FlowReturn<A, F>
  <A, B, C, D, E, F, G>(ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>, de: Fn<D, E>, ef: Fn<E, F>, fg: Fn<F, G>): FlowReturn<A, G>
  <A, B, C, D, E, F, G, H>(
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>,
    gh: Fn<G, H>
  ): FlowReturn<A, H>
  <A, B, C, D, E, F, G, H, I>(
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>,
    gh: Fn<G, H>,
    hi: Fn<H, I>
  ): FlowReturn<A, I>
  (...fns: Array<Fn<any, any>>): (a: unknown) => unknown
}

interface AsyncFlow {
  <A, B>(ab: PFn<A, B>): FlowPromiseChange<A, B>
  <A, B, C>(ab: PFn<A, B>, bc: PFn<B, C>): FlowPromiseChange<A, C>
  <A, B, C, D>(ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>): FlowPromiseChange<A, D>
  <A, B, C, D, E>(ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>, de: PFn<D, E>): FlowPromiseChange<A, E>
  <A, B, C, D, E, F>(ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>, de: PFn<D, E>, ef: PFn<E, F>): FlowPromiseChange<A, F>
  <A, B, C, D, E, F, G>(
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>
  ): FlowPromiseChange<A, G>
  <A, B, C, D, E, F, G, H>(
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>,
    gh: PFn<G, H>
  ): FlowPromiseChange<A, H>
  <A, B, C, D, E, F, G, H, I>(
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>,
    gh: PFn<G, H>,
    hi: PFn<H, I>
  ): FlowPromiseChange<A, I>
  (...fns: Array<PFn<any, any>>): (a: unknown) => Promise<unknown>
}

interface Flow extends AutoFlow {
  readonly sync: SyncFlow
  readonly async: AsyncFlow
}

function sync_flow(...fns: Array<Fn<any, any>>) {
  return (a: any) => pipe.sync(a, ...fns)
}

function async_flow(...fns: Array<Fn<any, any>>) {
  return async (a: any) => await pipe.async(a, ...fns)
}

function auto_flow(...fns: Array<Fn<any, any>>) {
  return fns.some((i) => is_async_func(i)) ? async_flow(...fns) : sync_flow(...fns)
}

export const flow: Flow = Object.assign(auto_flow, {
  sync: sync_flow,
  async: async_flow,
})

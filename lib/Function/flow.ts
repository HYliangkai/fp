import {
  type Fn,
  type PFn,
  type FlowReturn,
  type PipeShuntReturn,
  type CollPipeShunt,
  type PipeShunt,
  type PromisePipeShuntReturn,
  type PromisePipeShunt,
  type PromiseCollPipeShunt,
  type AutoPipeShuntReturn,
  type AutoCollPipeShunt,
  type AutoPipeShunt,
  pipe,
  is_async_func,
} from '@chzky/fp'

interface AutoFlow {
  /** ## FLow : pipe的科里化版本 */
  <A, B>(ab: PFn<A, B>): FlowReturn<A, AutoPipeShuntReturn<null, B>>
  <A, B, C>(ab: PFn<A, B>, bc: PFn<AutoPipeShunt<B>, C>): FlowReturn<A, AutoPipeShuntReturn<B, C>>
  <A, B, C, D>(
    ab: PFn<A, B>,
    bc: PFn<AutoPipeShunt<B>, C>,
    cd: PFn<AutoPipeShunt<C>, D>
  ): FlowReturn<A, AutoPipeShuntReturn<AutoCollPipeShunt<B, C>, D>>
  <A, B, C, D, E>(
    ab: PFn<A, B>,
    bc: PFn<AutoPipeShunt<B>, C>,
    cd: PFn<AutoPipeShunt<C>, D>,
    de: PFn<AutoPipeShunt<D>, E>
  ): FlowReturn<A, AutoPipeShuntReturn<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>>
  <A, B, C, D, E, F>(
    ab: PFn<A, B>,
    bc: PFn<AutoPipeShunt<B>, C>,
    cd: PFn<AutoPipeShunt<C>, D>,
    de: PFn<AutoPipeShunt<D>, E>,
    ef: PFn<AutoPipeShunt<E>, F>
  ): FlowReturn<
    A,
    AutoPipeShuntReturn<AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>, F>
  >
  <A, B, C, D, E, F, G>(
    ab: PFn<A, B>,
    bc: PFn<AutoPipeShunt<B>, C>,
    cd: PFn<AutoPipeShunt<C>, D>,
    de: PFn<AutoPipeShunt<D>, E>,
    ef: PFn<AutoPipeShunt<E>, F>,
    fg: PFn<AutoPipeShunt<F>, G>
  ): FlowReturn<
    A,
    AutoPipeShuntReturn<
      AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>, F>,
      G
    >
  >
  <A, B, C, D, E, F, G, H>(
    ab: PFn<A, B>,
    bc: PFn<AutoPipeShunt<B>, C>,
    cd: PFn<AutoPipeShunt<C>, D>,
    de: PFn<AutoPipeShunt<D>, E>,
    ef: PFn<AutoPipeShunt<E>, F>,
    fg: PFn<AutoPipeShunt<F>, G>,
    gh: PFn<AutoPipeShunt<G>, H>
  ): FlowReturn<
    A,
    AutoPipeShuntReturn<
      AutoCollPipeShunt<
        AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>, F>,
        G
      >,
      H
    >
  >
  <A, B, C, D, E, F, G, H, I>(
    ab: PFn<A, B>,
    bc: PFn<AutoPipeShunt<B>, C>,
    cd: PFn<AutoPipeShunt<C>, D>,
    de: PFn<AutoPipeShunt<D>, E>,
    ef: PFn<AutoPipeShunt<E>, F>,
    fg: PFn<AutoPipeShunt<F>, G>,
    gh: PFn<AutoPipeShunt<G>, H>,
    hi: PFn<AutoPipeShunt<H>, I>
  ): FlowReturn<
    A,
    AutoPipeShuntReturn<
      AutoCollPipeShunt<
        AutoCollPipeShunt<
          AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>, F>,
          G
        >,
        H
      >,
      I
    >
  >
  (...fns: Array<PFn<any, any>>): (a: unknown) => unknown
}

interface SyncFlow {
  <A, B>(ab: Fn<A, B>): FlowReturn<A, PipeShuntReturn<null, B>>
  <A, B, C>(ab: Fn<A, B>, bc: Fn<PipeShunt<B>, C>): FlowReturn<A, PipeShuntReturn<B, C>>
  <A, B, C, D>(ab: Fn<A, B>, bc: Fn<PipeShunt<B>, C>, cd: Fn<PipeShunt<C>, D>): FlowReturn<
    A,
    PipeShuntReturn<CollPipeShunt<B, C>, D>
  >
  <A, B, C, D, E>(
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>
  ): FlowReturn<A, PipeShuntReturn<CollPipeShunt<CollPipeShunt<B, C>, D>, E>>
  <A, B, C, D, E, F>(
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>,
    ef: Fn<PipeShunt<E>, F>
  ): FlowReturn<A, PipeShuntReturn<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>>
  <A, B, C, D, E, F, G>(
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>,
    ef: Fn<PipeShunt<E>, F>,
    fg: Fn<PipeShunt<F>, G>
  ): FlowReturn<
    A,
    PipeShuntReturn<CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>, G>
  >
  <A, B, C, D, E, F, G, H>(
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>,
    ef: Fn<PipeShunt<E>, F>,
    fg: Fn<PipeShunt<F>, G>,
    gh: Fn<PipeShunt<G>, H>
  ): FlowReturn<
    A,
    PipeShuntReturn<
      CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>, G>,
      H
    >
  >
  <A, B, C, D, E, F, G, H, I>(
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>,
    ef: Fn<PipeShunt<E>, F>,
    fg: Fn<PipeShunt<F>, G>,
    gh: Fn<PipeShunt<G>, H>,
    hi: Fn<PipeShunt<H>, I>
  ): FlowReturn<
    A,
    PipeShuntReturn<
      CollPipeShunt<
        CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>, G>,
        H
      >,
      I
    >
  >
  (...fns: Array<Fn<any, any>>): (a: unknown) => unknown
}

interface AsyncFlow {
  <A, B>(ab: PFn<A, B>): FlowReturn<A, PromisePipeShuntReturn<null, B>>
  <A, B, C>(ab: PFn<A, B>, bc: PFn<PromisePipeShunt<B>, C>): FlowReturn<
    A,
    PromisePipeShuntReturn<B, C>
  >
  <A, B, C, D>(
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>
  ): FlowReturn<A, PromisePipeShuntReturn<PromiseCollPipeShunt<B, C>, D>>
  <A, B, C, D, E>(
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>
  ): FlowReturn<A, PromisePipeShuntReturn<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>>
  <A, B, C, D, E, F>(
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>,
    ef: PFn<PromisePipeShunt<E>, F>
  ): FlowReturn<
    A,
    PromisePipeShuntReturn<
      PromiseCollPipeShunt<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>,
      F
    >
  >
  <A, B, C, D, E, F, G>(
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>,
    ef: PFn<PromisePipeShunt<E>, F>,
    fg: PFn<PromisePipeShunt<F>, G>
  ): FlowReturn<
    A,
    PromisePipeShuntReturn<
      PromiseCollPipeShunt<
        PromiseCollPipeShunt<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>,
        F
      >,
      G
    >
  >
  <A, B, C, D, E, F, G, H>(
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>,
    ef: PFn<PromisePipeShunt<E>, F>,
    fg: PFn<PromisePipeShunt<F>, G>,
    gh: PFn<PromisePipeShunt<G>, H>
  ): FlowReturn<
    A,
    PromisePipeShuntReturn<
      PromiseCollPipeShunt<
        PromiseCollPipeShunt<
          PromiseCollPipeShunt<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>,
          F
        >,
        G
      >,
      H
    >
  >
  <A, B, C, D, E, F, G, H, I>(
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>,
    ef: PFn<PromisePipeShunt<E>, F>,
    fg: PFn<PromisePipeShunt<F>, G>,
    gh: PFn<PromisePipeShunt<G>, H>,
    hi: PFn<PromisePipeShunt<H>, I>
  ): FlowReturn<
    A,
    PromisePipeShuntReturn<
      PromiseCollPipeShunt<
        PromiseCollPipeShunt<
          PromiseCollPipeShunt<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>,
          F
        >,
        G
      >,
      I
    >
  >
  (...fns: Array<PFn<any, any>>): (a: unknown) => Promise<unknown>
}

interface Flow extends AutoFlow {
  readonly sync: SyncFlow
  readonly async: AsyncFlow
}

const sync_flow = (...fns: Array<Fn<any, any>>): any => {
  return (a: any) => pipe.sync(a, ...fns)
}

const async_flow = (...fns: Array<Fn<any, any>>): any => {
  return async (a: any) => await pipe.async(a, ...fns)
}

const auto_flow = (...fns: Array<Fn<any, any>>): any => {
  return fns.some((i) => is_async_func(i)) ? async_flow(...fns) : sync_flow(...fns)
}

/** ## FLow : pipe的科里化版本 */
export const flow: Flow = Object.assign(auto_flow, {
  sync: sync_flow,
  async: async_flow,
})

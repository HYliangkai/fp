import {
  type Fn,
  type PFn,
  type PromiseChange,
  type AutoPipeShuntReturn,
  type AutoPipeShunt,
  type AutoCollPipeShunt,
  type PipeShuntReturn,
  type PipeShunt,
  type CollPipeShunt,
  type PromisePipeShuntReturn,
  type PromiseCollPipeShunt,
  type PromisePipeShunt,
  pipe,
  is_async_func,
} from '@chzky/fp'

interface AutoLazyPipe {
  /** ## lzpipe : 惰性运行的{@link pipe}
  @example
  ```ts

  //Synchronization function
  const res = pipe(
    1,//1
    (x: number) => x + 1,//2
    (x: number) => x * 2,//4
    (x: number) => x + 1,//5
  )
  assertEquals(res(), 5)

  //Asynchronous function
  const res2 = await pipe(
    's',
    (x: string) => x + 'a',
    async (x: string) => x + 'b',
  ))
  assertEquals(res2(), 'sab')
  ```    
   */
  <A>(a: A): () => A
  <A, B>(a: A, b: PFn<A, B>): () => AutoPipeShuntReturn<null, B>
  <A, B, C>(a: A, b: PFn<A, B>, c: PFn<AutoPipeShunt<B>, C>): () => AutoPipeShuntReturn<B, C>
  <A, B, C, D>(
    a: A,
    b: PFn<A, B>,
    c: PFn<AutoPipeShunt<B>, C>,
    d: PFn<AutoPipeShunt<C>, D>
  ): () => AutoPipeShuntReturn<AutoCollPipeShunt<B, C>, D>
  <A, B, C, D, E>(
    a: A,
    b: PFn<A, B>,
    c: PFn<AutoPipeShunt<B>, C>,
    d: PFn<AutoPipeShunt<C>, D>,
    e: PFn<AutoPipeShunt<D>, E>
  ): () => AutoPipeShuntReturn<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>
  <A, B, C, D, E, F>(
    a: A,
    b: PFn<A, B>,
    c: PFn<AutoPipeShunt<B>, C>,
    d: PFn<AutoPipeShunt<C>, D>,
    e: PFn<AutoPipeShunt<D>, E>,
    f: PFn<AutoPipeShunt<E>, F>
  ): () => AutoPipeShuntReturn<
    AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>,
    F
  >
  <A, B, C, D, E, F, G>(
    a: A,
    b: PFn<A, B>,
    c: PFn<AutoPipeShunt<B>, C>,
    d: PFn<AutoPipeShunt<C>, D>,
    e: PFn<AutoPipeShunt<D>, E>,
    f: PFn<AutoPipeShunt<E>, F>,
    g: PFn<AutoPipeShunt<F>, G>
  ): () => AutoPipeShuntReturn<
    AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>, F>,
    G
  >
  <A, B, C, D, E, F, G, H>(
    a: A,
    b: PFn<A, B>,
    c: PFn<AutoPipeShunt<B>, C>,
    d: PFn<AutoPipeShunt<C>, D>,
    e: PFn<AutoPipeShunt<D>, E>,
    f: PFn<AutoPipeShunt<E>, F>,
    g: PFn<AutoPipeShunt<F>, G>,
    h: PFn<AutoPipeShunt<G>, H>
  ): () => AutoPipeShuntReturn<
    AutoCollPipeShunt<
      AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>, F>,
      G
    >,
    H
  >
  <A, B, C, D, E, F, G, H, I>(
    a: A,
    b: PFn<A, B>,
    c: PFn<AutoPipeShunt<B>, C>,
    d: PFn<AutoPipeShunt<C>, D>,
    e: PFn<AutoPipeShunt<D>, E>,
    f: PFn<AutoPipeShunt<E>, F>,
    g: PFn<AutoPipeShunt<F>, G>,
    h: PFn<AutoPipeShunt<G>, H>,
    i: PFn<AutoPipeShunt<H>, I>
  ): () => AutoPipeShuntReturn<
    AutoCollPipeShunt<
      AutoCollPipeShunt<
        AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>, F>,
        G
      >,
      H
    >,
    I
  >
  (a: any, ...fns: Array<PFn<any, any>>): () => any
}

interface SyncLazyPipe {
  <A>(a: A): () => A
  <A, B>(a: A, ab: Fn<A, B>): () => PipeShuntReturn<null, B>
  <A, B, C>(a: A, ab: Fn<A, B>, bc: Fn<PipeShunt<B>, C>): () => PipeShuntReturn<B, C>
  <A, B, C, D>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>
  ): () => PipeShuntReturn<CollPipeShunt<B, C>, D>
  <A, B, C, D, E>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>
  ): () => PipeShuntReturn<CollPipeShunt<CollPipeShunt<B, C>, D>, E>
  <A, B, C, D, E, F>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>,
    ef: Fn<PipeShunt<E>, F>
  ): () => PipeShuntReturn<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>
  <A, B, C, D, E, F, G>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>,
    ef: Fn<PipeShunt<E>, F>,
    fg: Fn<PipeShunt<F>, G>
  ): () => PipeShuntReturn<
    CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>,
    G
  >
  <A, B, C, D, E, F, G, H>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>,
    ef: Fn<PipeShunt<E>, F>,
    fg: Fn<PipeShunt<F>, G>,
    gh: Fn<PipeShunt<G>, H>
  ): () => PipeShuntReturn<
    CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>, G>,
    H
  >
  <A, B, C, D, E, F, G, H, I>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>,
    ef: Fn<PipeShunt<E>, F>,
    fg: Fn<PipeShunt<F>, G>,
    gh: Fn<PipeShunt<G>, H>,
    hi: Fn<PipeShunt<H>, I>
  ): () => PipeShuntReturn<
    CollPipeShunt<
      CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>, G>,
      H
    >,
    I
  >

  (a: any, ...fns: Array<Fn<any, any>>): () => any
}

interface AsyncLazyPipe {
  <A>(a: A): () => PromiseChange<A>
  <A, B>(a: A, ab: PFn<A, B>): () => PromisePipeShuntReturn<null, B>
  <A, B, C>(a: A, ab: PFn<A, B>, bc: PFn<PromisePipeShunt<B>, C>): () => PromisePipeShuntReturn<
    B,
    C
  >
  <A, B, C, D>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>
  ): () => PromisePipeShuntReturn<PromiseCollPipeShunt<B, C>, D>
  <A, B, C, D, E>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>
  ): () => PromisePipeShuntReturn<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>
  <A, B, C, D, E, F>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>,
    ef: PFn<PromisePipeShunt<E>, F>
  ): () => PromisePipeShuntReturn<
    PromiseCollPipeShunt<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>,
    F
  >
  <A, B, C, D, E, F, G>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>,
    ef: PFn<PromisePipeShunt<E>, F>,
    fg: PFn<PromisePipeShunt<F>, G>
  ): () => PromisePipeShuntReturn<
    PromiseCollPipeShunt<
      PromiseCollPipeShunt<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>,
      F
    >,
    G
  >
  <A, B, C, D, E, F, G, H>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>,
    ef: PFn<PromisePipeShunt<E>, F>,
    fg: PFn<PromisePipeShunt<F>, G>,
    gh: PFn<PromisePipeShunt<G>, H>
  ): () => PromisePipeShuntReturn<
    PromiseCollPipeShunt<
      PromiseCollPipeShunt<
        PromiseCollPipeShunt<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>,
        F
      >,
      G
    >,
    H
  >
  <A, B, C, D, E, F, G, H, I>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>,
    ef: PFn<PromisePipeShunt<E>, F>,
    fg: PFn<PromisePipeShunt<F>, G>,
    gh: PFn<PromisePipeShunt<G>, H>,
    hi: PFn<PromisePipeShunt<H>, I>
  ): () => PromisePipeShuntReturn<
    PromiseCollPipeShunt<
      PromiseCollPipeShunt<
        PromiseCollPipeShunt<
          PromiseCollPipeShunt<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>,
          F
        >,
        G
      >,
      H
    >,
    I
  >
  (a: any, ...fns: Array<PFn<any, any>>): () => PromiseChange<any>
}

interface LazyPipe extends AutoLazyPipe {
  readonly sync: SyncLazyPipe
  readonly async: AsyncLazyPipe
}

const sync_lzpipe = (...fns: Array<Fn<any, any>>): any => {
  return () => pipe.sync(...fns)
}
const async_lzpipe = (...fns: Array<PFn<any, any>>): any => {
  return async () => await pipe.async(...fns)
}

const auto_lzpipe = (...fns: Array<PFn<any, any>>): any => {
  return fns.some((i) => is_async_func(i)) ? async_lzpipe(...fns) : sync_lzpipe(...fns)
}

/** ## lzpipe : 惰性运行的{@link pipe}
  @example
  ```ts

  //Synchronization function
  const res = pipe(
    1,//1
    (x: number) => x + 1,//2
    (x: number) => x * 2,//4
    (x: number) => x + 1,//5
  )
  assertEquals(res(), 5)

  //Asynchronous function
  const res2 = await pipe(
    's',
    (x: string) => x + 'a',
    async (x: string) => x + 'b',
  ))
  assertEquals(res2(), 'sab')
  ```    
   */
export const lzpipe: LazyPipe = Object.assign(auto_lzpipe, {
  sync: sync_lzpipe,
  async: async_lzpipe,
})

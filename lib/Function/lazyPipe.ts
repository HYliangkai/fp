import { Fn, PFn, PipeResult, PromiseChange, PromiseLine, is_async_func, pipe } from '../../mod.ts'

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
  <A, B>(a: A, b: PFn<A, B>): () => PipeResult<B, A>
  <A, B, C>(a: A, b: PFn<A, B>, c: PFn<B, C>): () => PipeResult<C, B>
  <A, B, C, D>(a: A, b: PFn<A, B>, c: PFn<B, C>, d: PFn<C, D>): () => PipeResult<D, PromiseLine<C, B>>
  <A, B, C, D, E>(a: A, b: PFn<A, B>, c: PFn<B, C>, d: PFn<C, D>, e: PFn<D, E>): () => PipeResult<
    E,
    PromiseLine<D, PromiseLine<C, B>>
  >
  <A, B, C, D, E, F>(a: A, b: PFn<A, B>, c: PFn<B, C>, d: PFn<C, D>, e: PFn<D, E>, f: PFn<E, F>): () => PipeResult<
    F,
    PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>
  >
  <A, B, C, D, E, F, G>(
    a: A,
    b: PFn<A, B>,
    c: PFn<B, C>,
    d: PFn<C, D>,
    e: PFn<D, E>,
    f: PFn<E, F>,
    g: PFn<F, G>
  ): () => PipeResult<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
  <A, B, C, D, E, F, G, H>(
    a: A,
    b: PFn<A, B>,
    c: PFn<B, C>,
    d: PFn<C, D>,
    e: PFn<D, E>,
    f: PFn<E, F>,
    g: PFn<F, G>,
    h: PFn<G, H>
  ): () => PipeResult<H, PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>>
  <A, B, C, D, E, F, G, H, I>(
    a: A,
    b: PFn<A, B>,
    c: PFn<B, C>,
    d: PFn<C, D>,
    e: PFn<D, E>,
    f: PFn<E, F>,
    g: PFn<F, G>,
    h: PFn<G, H>,
    i: PFn<H, I>
  ): () => PipeResult<I, PromiseLine<H, PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>>>
  (a: any, ...fns: Array<PFn<any, any>>): () => any
}

interface SyncLazyPipe {
  <A>(a: A): () => A
  <A, B>(a: A, ab: Fn<A, B>): () => B
  <A, B, C>(a: A, ab: Fn<A, B>, bc: Fn<B, C>): () => C
  <A, B, C, D>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>): () => D
  <A, B, C, D, E>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>, de: Fn<D, E>): () => E
  <A, B, C, D, E, F>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>, de: Fn<D, E>, ef: Fn<E, F>): () => F
  <A, B, C, D, E, F, G>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>, de: Fn<D, E>, ef: Fn<E, F>, fg: Fn<F, G>): () => G
  <A, B, C, D, E, F, G, H>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>,
    gh: Fn<G, H>
  ): () => H
  <A, B, C, D, E, F, G, H, I>(
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
  (a: any, ...fns: Array<Fn<any, any>>): () => any
}

interface AsyncLazyPipe {
  <A>(a: A): () => PromiseChange<A>
  <A, B>(a: A, ab: PFn<A, B>): () => PromiseChange<B>
  <A, B, C>(a: A, ab: PFn<A, B>, bc: PFn<B, C>): () => PromiseChange<C>
  <A, B, C, D>(a: A, ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>): () => PromiseChange<D>
  <A, B, C, D, E>(a: A, ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>, de: PFn<D, E>): () => PromiseChange<E>
  <A, B, C, D, E, F>(a: A, ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>, de: PFn<D, E>, ef: PFn<E, F>): () => PromiseChange<F>
  <A, B, C, D, E, F, G>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>
  ): () => PromiseChange<G>
  <A, B, C, D, E, F, G, H>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>,
    gh: PFn<G, H>
  ): () => PromiseChange<H>
  <A, B, C, D, E, F, G, H, I>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>,
    gh: PFn<G, H>,
    hi: PFn<H, I>
  ): () => PromiseChange<I>
  (a: any, ...fns: Array<PFn<any, any>>): () => PromiseChange<any>
}

interface LazyPipe extends AutoLazyPipe {
  readonly sync: SyncLazyPipe
  readonly async: AsyncLazyPipe
}

function sync_lzpipe(...fns: Array<Fn<any, any>>) {
  return () => pipe.sync(...fns)
}
function async_lzpipe(...fns: Array<PFn<any, any>>) {
  return async () => await pipe.async(...fns)
}

function auto_lzpipe(...fns: Array<PFn<any, any>>): any {
  return fns.some((i) => is_async_func(i)) ? async_lzpipe(...fns) : sync_lzpipe(...fns)
}

export const lzpipe: LazyPipe = Object.assign(auto_lzpipe, {
  sync: sync_lzpipe,
  async: async_lzpipe,
})

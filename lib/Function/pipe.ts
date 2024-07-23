import {
  type Fn,
  type PFn,
  type PipeResult,
  type PromiseChange,
  type PromiseLine,
  is_async_func,
} from '../../mod.ts'

interface AutoPipe {
  /** ## pipe : 函数嵌套参数化运行
  @example
  ```ts

  //Synchronization function
  const res = pipe(
    1,//1
    (x: number) => x + 1,//2
    (x: number) => x * 2,//4
    (x: number) => x + 1,//5
  )
  assertEquals(res, 5)

  //Asynchronous function
  const res2 = await pipe(
    's',
    (x: string) => x + 'a',
    async (x: string) => x + 'b',
  ))
  assertEquals(res2, 'sab')
  ```
  @tips
  能自动解包Promise作为参数传递运行的情况 :
    + 传入的函数中有一个是带async关键字的函数 <只需含有一个即可辨别>
    + 可await运行的flow/lzpipe
    + 能否当成异步函数运行主要取决于{@link is_async_func}这个函数

  @category Function
  */
  <A>(a: A): A
  <A, B>(a: A, b: PFn<A, B>): PipeResult<B, A>
  <A, B, C>(a: A, b: PFn<A, B>, c: PFn<B, C>): PipeResult<C, B>
  <A, B, C, D>(a: A, b: PFn<A, B>, c: PFn<B, C>, d: PFn<C, D>): PipeResult<D, PromiseLine<C, B>>
  <A, B, C, D, E>(a: A, b: PFn<A, B>, c: PFn<B, C>, d: PFn<C, D>, e: PFn<D, E>): PipeResult<
    E,
    PromiseLine<D, PromiseLine<C, B>>
  >
  <A, B, C, D, E, F>(
    a: A,
    b: PFn<A, B>,
    c: PFn<B, C>,
    d: PFn<C, D>,
    e: PFn<D, E>,
    f: PFn<E, F>
  ): PipeResult<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>
  <A, B, C, D, E, F, G>(
    a: A,
    b: PFn<A, B>,
    c: PFn<B, C>,
    d: PFn<C, D>,
    e: PFn<D, E>,
    f: PFn<E, F>,
    g: PFn<F, G>
  ): PipeResult<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
  <A, B, C, D, E, F, G, H>(
    a: A,
    b: PFn<A, B>,
    c: PFn<B, C>,
    d: PFn<C, D>,
    e: PFn<D, E>,
    f: PFn<E, F>,
    g: PFn<F, G>,
    h: PFn<G, H>
  ): PipeResult<
    H,
    PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
  >
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
  ): PipeResult<
    I,
    PromiseLine<
      H,
      PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
    >
  >
  (...fns: Array<PFn<any, any>>): unknown
}

interface SyncPipe {
  /** ## pipe.sync : 不会自动解包Promise的pipe
@example
```ts
  const origin = 0
  const first = (x: number) => x + 1
  const second = (x: number) => x * 2
  const third = (x: number) => Promise.resolve(x + 11)
  const res = pipe.sync(origin, first, second)
  assertEquals(res, 2)

  pipe
    .sync(origin, third, async (r) => {
      return (await r) + 1
    })
    .then((res) => {
      assertEquals(res, 12)
    })
```
  @category Function
 */
  <A>(a: A): A
  <A, B>(a: A, ab: Fn<A, B>): B
  <A, B, C>(a: A, ab: Fn<A, B>, bc: Fn<B, C>): C
  <A, B, C, D>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>): D
  <A, B, C, D, E>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>, de: Fn<D, E>): E
  <A, B, C, D, E, F>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>, de: Fn<D, E>, ef: Fn<E, F>): F
  <A, B, C, D, E, F, G>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>
  ): G
  <A, B, C, D, E, F, G, H>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>,
    gh: Fn<G, H>
  ): H
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
  ): I
  (...fns: Array<Fn<any, any>>): unknown
}

interface AsyncPipe {
  /** ## pipe.async : 会自动解包Promise的pipe
@example
```ts
  const origin = 0
  const first = (x: number) => x + 1
  const second = (x: number) => x * 2
  const third = (x: number) => Promise.resolve(x + 11)

  const res = await pipe.async(origin, first, second)
  assertEquals(res, 2)

  const res2 = await pipe.async(origin, third, first)
  assertEquals(res2, 12)
```
  @category Function
  */
  <A>(a: A): PromiseChange<A>
  <A, B>(a: A, ab: PFn<A, B>): PromiseChange<B>
  <A, B, C>(a: A, ab: PFn<A, B>, bc: PFn<B, C>): PromiseChange<C>
  <A, B, C, D>(a: A, ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>): PromiseChange<D>
  <A, B, C, D, E>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>
  ): PromiseChange<E>
  <A, B, C, D, E, F>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>
  ): PromiseChange<F>
  <A, B, C, D, E, F, G>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>
  ): PromiseChange<G>
  <A, B, C, D, E, F, G, H>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<B, C>,
    cd: PFn<C, D>,
    de: PFn<D, E>,
    ef: PFn<E, F>,
    fg: PFn<F, G>,
    gh: PFn<G, H>
  ): PromiseChange<H>
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
  ): PromiseChange<I>
  (...fns: Array<Fn<any, any>>): Promise<unknown>
}

interface Pipe extends AutoPipe {
  readonly sync: SyncPipe
  readonly async: AsyncPipe
}

const sync_pipe = (...fns: Array<Fn<any, any>>): any => {
  let ret = fns[0]
  for (let idx = 1; idx < fns.length; idx++) {
    ret = fns[idx](ret)
  }
  return ret
}

const async_pipe = async (...fns: Array<Fn<any, any>>) => {
  let ret = fns[0]
  for (let idx = 1; idx < fns.length; idx++) {
    ret = await Promise.resolve(fns[idx](ret))
  }
  return ret
}

const auto_pipe = (...fns: Array<PFn<any, any>>): any =>
  fns.some((i) => is_async_func(i)) ? async_pipe(...fns) : sync_pipe(...fns)

export const pipe: Pipe = Object.assign(auto_pipe, {
  sync: sync_pipe,
  async: async_pipe,
})

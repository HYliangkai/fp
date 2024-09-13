import {
  type Fn,
  type PFn,
  type PipeShunt,
  type PromiseChange,
  type CollPipeShunt,
  type PipeShuntReturn,
  type PromisePipeShunt,
  type PromiseCollPipeShunt,
  type PromisePipeShuntReturn,
  type AutoPipeShuntReturn,
  type AutoPipeShunt,
  type AutoCollPipeShunt,
  is_async_func,
  is_mainstream,
  is_reflux,
} from '@chzky/fp'

interface AutoPipe {
  /** ## pipe : 函数嵌套参数化运行; [point free](https://wiki.haskell.org/Pointfree)在Ts中的实现
  @example Usage
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
  1. 最好有三个及以上的函数调用才能体现出pipe的优势
  2. 能自动解包Promise作为参数传递运行的情况 :
    + 能否当成异步函数运行主要取决于{@link is_async_func}这个函数
    + 传入的函数中有一个是带async关键字的函数 <只需含有一个即可辨别>
    + 可await运行的flow/lzpipe

  @category Function
  */
  <A>(a: A): A
  <A, B>(a: A, b: PFn<A, B>): AutoPipeShuntReturn<null, B>
  <A, B, C>(a: A, b: PFn<A, B>, c: PFn<AutoPipeShunt<B>, C>): AutoPipeShuntReturn<B, C>
  <A, B, C, D>(
    a: A,
    b: PFn<A, B>,
    c: PFn<AutoPipeShunt<B>, C>,
    d: PFn<AutoPipeShunt<C>, D>
  ): AutoPipeShuntReturn<AutoCollPipeShunt<B, C>, D>
  <A, B, C, D, E>(
    a: A,
    b: PFn<A, B>,
    c: PFn<AutoPipeShunt<B>, C>,
    d: PFn<AutoPipeShunt<C>, D>,
    e: PFn<AutoPipeShunt<D>, E>
  ): AutoPipeShuntReturn<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>
  <A, B, C, D, E, F>(
    a: A,
    b: PFn<A, B>,
    c: PFn<AutoPipeShunt<B>, C>,
    d: PFn<AutoPipeShunt<C>, D>,
    e: PFn<AutoPipeShunt<D>, E>,
    f: PFn<AutoPipeShunt<E>, F>
  ): AutoPipeShuntReturn<AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>, F>
  <A, B, C, D, E, F, G>(
    a: A,
    b: PFn<A, B>,
    c: PFn<AutoPipeShunt<B>, C>,
    d: PFn<AutoPipeShunt<C>, D>,
    e: PFn<AutoPipeShunt<D>, E>,
    f: PFn<AutoPipeShunt<E>, F>,
    g: PFn<AutoPipeShunt<F>, G>
  ): AutoPipeShuntReturn<
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
  ): AutoPipeShuntReturn<
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
  ): AutoPipeShuntReturn<
    AutoCollPipeShunt<
      AutoCollPipeShunt<
        AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<AutoCollPipeShunt<B, C>, D>, E>, F>,
        G
      >,
      H
    >,
    I
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
  <A, B>(a: A, ab: Fn<A, B>): PipeShuntReturn<null, B>
  <A, B, C>(a: A, ab: Fn<A, B>, bc: Fn<PipeShunt<B>, C>): PipeShuntReturn<B, C>
  <A, B, C, D>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>
  ): PipeShuntReturn<CollPipeShunt<B, C>, D>
  <A, B, C, D, E>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>
  ): PipeShuntReturn<CollPipeShunt<CollPipeShunt<B, C>, D>, E>
  <A, B, C, D, E, F>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>,
    ef: Fn<PipeShunt<E>, F>
  ): PipeShuntReturn<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>
  <A, B, C, D, E, F, G>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<PipeShunt<B>, C>,
    cd: Fn<PipeShunt<C>, D>,
    de: Fn<PipeShunt<D>, E>,
    ef: Fn<PipeShunt<E>, F>,
    fg: Fn<PipeShunt<F>, G>
  ): PipeShuntReturn<CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>, G>
  <A, B, C, D, E, F, G, H>(
    a: A,
    ab: Fn<A, B>,
    cd: Fn<PipeShunt<B>, C>,
    de: Fn<PipeShunt<C>, D>,
    ef: Fn<PipeShunt<D>, E>,
    fg: Fn<PipeShunt<E>, F>,
    gh: Fn<PipeShunt<F>, H>
  ): PipeShuntReturn<
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
  ): PipeShuntReturn<
    CollPipeShunt<
      CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<CollPipeShunt<B, C>, D>, E>, F>, G>,
      H
    >,
    I
  >

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
  <A, B>(a: A, ab: PFn<A, B>): PromisePipeShuntReturn<null, B>
  <A, B, C>(a: A, ab: PFn<A, B>, bc: PFn<PromisePipeShunt<B>, C>): PromisePipeShuntReturn<B, C>
  <A, B, C, D>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>
  ): PromisePipeShuntReturn<PromiseCollPipeShunt<B, C>, D>
  <A, B, C, D, E>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>
  ): PromisePipeShuntReturn<PromiseCollPipeShunt<PromiseCollPipeShunt<B, C>, D>, E>
  <A, B, C, D, E, F>(
    a: A,
    ab: PFn<A, B>,
    bc: PFn<PromisePipeShunt<B>, C>,
    cd: PFn<PromisePipeShunt<C>, D>,
    de: PFn<PromisePipeShunt<D>, E>,
    ef: PFn<PromisePipeShunt<E>, F>
  ): PromisePipeShuntReturn<
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
  ): PromisePipeShuntReturn<
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
  ): PromisePipeShuntReturn<
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
  ): PromisePipeShuntReturn<
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
    if (is_reflux(ret)) return ret.unwrap()
    if (is_mainstream(ret)) ret = ret.unwrap()
  }
  return ret
}

const async_pipe = async (...fns: Array<Fn<any, any>>) => {
  let ret = fns[0]
  for (let idx = 1; idx < fns.length; idx++) {
    ret = await Promise.resolve(fns[idx](ret))
    if (is_reflux(ret)) return ret.unwrap()
    if (is_mainstream(ret)) ret = ret.unwrap()
  }
  return ret
}

const auto_pipe = (...fns: Array<PFn<any, any>>): any =>
  fns.some((i) => is_async_func(i)) ? async_pipe(...fns) : sync_pipe(...fns)

/** ## pipe : 函数嵌套参数化运行; [point free](https://wiki.haskell.org/Pointfree)在Ts中的实现
  @example  basic
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
  @example  pipe配合 Shunt 数据结构,做到 '截流' 操作
  ```ts
  // 一个io操作:可能存在异常情况
  const io_operate = (path: string): Result<string, IllegalOperatError> => {
    if (path === 'mod.ts') return Ok(path)
    return IllegalOperatError.err('your path is not exist')
  }

  // 截流操作 : 如果数据返回Err就直接返回,否则就进行解包然后进行下一步操作
  const closure = (
    result: Result<string, IllegalOperatError>
  ): Shunt<string, Err<IllegalOperatError>> => {
    if (result.is_ok) return Mainstream(result.unwrap())
    return Reflux(result as Err<IllegalOperatError>)
  }

  // 读取到地址的后续操作
  const io_then = (path: string) => {
    assert(path === 'mod.ts')
    return Ok(true)
  }

  // 'mos' --io_operate--> Result<string, IllegalOperatError> --closure--> Shunt<string, Err<IllegalOperatError>> -> if Mainstream -> io_then | if Reflux -> return

  const resf: Result<boolean, IllegalOperatError> = pipe('mos', io_operate, closure, io_then)
  assert((resf as Err<IllegalOperatError>).unwrap_err().instance_of(IllegalOperatError))

  const rest: Result<boolean, IllegalOperatError> = pipe('mos', io_operate, closure, io_then)
  assert(rest)
  ```
  @tips
  1. 最好有三个及以上的函数调用才能体现出pipe的优势
  2. 能自动解包Promise作为参数传递运行的情况 :
    + 能否当成异步函数运行主要取决于{@link is_async_func}这个函数
    + 传入的函数中有一个是带async关键字的函数 <只需含有一个即可辨别>
    + 可await运行的flow/lzpipe

  @category Function
  */
export const pipe: Pipe = Object.assign(auto_pipe, {
  sync: sync_pipe,
  async: async_pipe,
})

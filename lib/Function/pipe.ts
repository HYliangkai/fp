import {Async_Tag, is_async_func} from './mod.ts'

/** 带解包的fn */
type PFn<A, B> = (a: A extends Promise<infer U> ? U : A) => B

type PromiseLine<A, B> = A extends Promise<any>
  ? Promise<any>
  : B extends Promise<any>
  ? Promise<any>
  : B

/** ## PipeResult<A<B> : if A or B is Promise,return Promise ; else return NoPromise  */
type PipeResult<A, B> = A extends Promise<any> ? A : B extends Promise<any> ? Promise<A> : A

/** ## pipe : 函数嵌套参数化运行
  @example
  ```ts
  
  //Synchronization function
  console.log(pipe(
    1,//1
    (x: number) => x + 1,//2
    (x: number) => x * 2,//4
    (x: number) => x + 1,//5
  )) // 5

  //Asynchronous function
  console.log(await pipe(
    's',
    (x: string) => x + 'a',
    async (x: string) => x + 'b',
  )) // sab
  ```
  @warning
  1. 不要把Array.prototype上的函数作为参数传入,会运行不出来
  2. 允许使用await关键字运行的情况 :
    + 传入的函数中有一个是带async关键字的函数

  @category Function
*/

export function pipe<A>(a: A): A
export function pipe<A, B>(a: A, ab: PFn<A, B>): PipeResult<B, A>
export function pipe<A, B, C>(a: A, ab: PFn<A, B>, bc: PFn<B, C>): PipeResult<C, B>
export function pipe<A, B, C, D>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>
): PipeResult<D, PromiseLine<C, B>>
export function pipe<A, B, C, D, E>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>
): PipeResult<E, PromiseLine<D, PromiseLine<C, B>>>
export function pipe<A, B, C, D, E, F>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>
): PipeResult<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>
export function pipe<A, B, C, D, E, F, G>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>
): PipeResult<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>
export function pipe<A, B, C, D, E, F, G, H>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>,
  gh: PFn<G, H>
): PipeResult<H, PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>>
export function pipe<A, B, C, D, E, F, G, H, I>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>,
  gh: PFn<G, H>,
  hi: PFn<H, I>
): PipeResult<
  I,
  PromiseLine<H, PromiseLine<G, PromiseLine<F, PromiseLine<E, PromiseLine<D, PromiseLine<C, B>>>>>>
>

export function pipe(...fns: Array<PFn<any, any>>): any {
  let ret = fns[0]
  if (fns.some(i => is_async_func(i))) {
    return new Promise(async res => {
      for (let i = 1; i < fns.length; i++) {
        ret = await Promise.resolve(fns[i](ret))
      }
      res(ret)
    })
  } else {
    for (let i = 1; i < fns.length; i++) {
      ret = fns[i](ret)
    }
    return ret
  }
}

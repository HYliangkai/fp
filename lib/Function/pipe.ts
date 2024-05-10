/** 带解包的fn */
type PFn<A, B> = (a: A extends Promise<infer U> ? U : A) => B
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
  @category Function
*/

export function pipe<A>(a: A): A
export function pipe<A, B>(a: A, ab: PFn<A, B>): B
export function pipe<A, B, C>(a: A, ab: PFn<A, B>, bc: PFn<B, C>): C
export function pipe<A, B, C, D>(a: A, ab: PFn<A, B>, bc: PFn<B, C>, cd: PFn<C, D>): D
export function pipe<A, B, C, D, E>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>
): E
export function pipe<A, B, C, D, E, F>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>
): F
export function pipe<A, B, C, D, E, F, G>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>
): G
export function pipe<A, B, C, D, E, F, G, H>(
  a: A,
  ab: PFn<A, B>,
  bc: PFn<B, C>,
  cd: PFn<C, D>,
  de: PFn<D, E>,
  ef: PFn<E, F>,
  fg: PFn<F, G>,
  gh: PFn<G, H>
): H
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
): I
// 依此类推，根据需要添加更多的重载签名(手动)

//使用 any版本做函数的具体实现
export async function pipe(...fns: Array<PFn<any, any>>): Promise<any> {
  let ret = fns[0]
  for (let i = 1; i < fns.length; i++) {
    ret = await fns[i](ret)
  }
  return ret
}

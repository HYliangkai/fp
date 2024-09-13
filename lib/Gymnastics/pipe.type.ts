import type { Shunt } from '@chzky/fp'

/** 带解包Promise的fn */
export type PFn<A, B> = (a: A extends Promise<infer U> ? U : A) => B

/** 将数据带上Promise */
export type PromiseChange<A> = A extends Promise<infer U> ? Promise<U> : Promise<A>

/** ## PipeResult<A<B> : if A or B is Promise,return Promise ; else return NoPromise  */
export type PipeResult<A, B> = A extends Promise<any> ? A : B extends Promise<any> ? Promise<A> : A

export type FlowReturn<T, R> = (a: T) => R

export type PipeShunt<X> = X extends Shunt<infer M, any> ? M : X

export type PromisePipeShunt<X> = PromiseChange<X> extends Promise<Shunt<infer M, any>>
  ? Promise<M>
  : X

export type AutoPipeShunt<X> = X extends Promise<any> ? PromisePipeShunt<X> : PipeShunt<X>

export type CollPipeShunt<A, B> = A extends Shunt<any, infer M>
  ? B extends Shunt<any, infer M2>
    ? Shunt<any, M | M2>
    : Shunt<any, M>
  : B extends Shunt<any, infer M2>
  ? Shunt<any, M2>
  : null

export type PromiseCollPipeShunt<A, B> = PromiseChange<A> extends Promise<Shunt<any, infer M>>
  ? PromiseChange<B> extends Promise<Shunt<any, infer M2>>
    ? Promise<Shunt<any, M | M2>>
    : Promise<Shunt<any, M>>
  : PromiseChange<B> extends Promise<Shunt<any, infer M2>>
  ? Promise<Shunt<any, M2>>
  : null

export type AutoCollPipeShunt<A, B> = A extends Promise<any>
  ? PromiseCollPipeShunt<A, B>
  : B extends Promise<any>
  ? PromiseCollPipeShunt<A, B>
  : CollPipeShunt<A, B>

export type PipeShuntReturn<X, R> = X extends Shunt<any, infer F>
  ? (R extends Shunt<infer A, infer B> ? A | B : R) | F
  : R extends Shunt<infer A, infer B>
  ? A | B
  : R

export type PromisePipeShuntReturn<X, R> = PromiseChange<X> extends Promise<Shunt<any, infer F>>
  ? Promise<(PromiseChange<R> extends Promise<Shunt<infer A, infer B>> ? A | B : R) | F>
  : PromiseChange<R> extends Promise<Shunt<infer A1, infer B1>>
  ? Promise<A1 | B1>
  : Promise<R>

export type AutoPipeShuntReturn<X, R> = PipeResult<R, X> extends Promise<any>
  ? PromisePipeShuntReturn<X, R>
  : PipeShuntReturn<X, R>

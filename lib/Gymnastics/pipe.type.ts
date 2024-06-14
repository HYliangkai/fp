/** 带解包Promise的fn */
export type PFn<A, B> = (a: A extends Promise<infer U> ? U : A) => B

export type PromiseLine<A, B> = A extends Promise<any> ? Promise<any> : B extends Promise<any> ? Promise<any> : B

export type PromiseChange<A> = A extends Promise<infer U> ? Promise<U> : Promise<A>

/** ## PipeResult<A<B> : if A or B is Promise,return Promise ; else return NoPromise  */
export type PipeResult<A, B> = A extends Promise<any> ? A : B extends Promise<any> ? Promise<A> : A

/** ## PipeResult<A<B> : if A or B is Promise,return Promise ; else return NoPromise  */
export type FlowResult<T, A, B> = (a: T) => A extends Promise<any> ? A : B extends Promise<any> ? Promise<A> : A

export type FlowPromiseChange<T, A> = (a: T) => A extends Promise<infer U> ? Promise<U> : Promise<A>

export type FlowReturn<T, R> = (a: T) => R

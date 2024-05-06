/** ## promise_time_limit : 限制Promise须在time ms内完成,否则报错
@example
```ts
promise_time_limit(1000,new Promise((r)=>{
  setTimeout(r,1001)
})).then(
  ()=>{console.log('1000ms within')},
  ()=>{console.log('1000ms outside')})
```
@category Function
 */
export function promise_time_limit<T>(time: number, promise: Promise<T>): Promise<T> {
  return new Promise((res, rej) => {
    const timer = setTimeout(() => {
      rej(new Error('time out'))
    }, time)
    promise.then(res, rej).finally(() => {
      clearTimeout(timer)
    })
  })
}

/** ## promise_time_limit : 限制Promise须在time内完成 */
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

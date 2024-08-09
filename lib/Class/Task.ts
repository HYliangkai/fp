import { FnReturn, None, Option, Fn, Some, AsyncResult, UnexpectedError } from '@chzky/fp'

type TaskUnit = [FnReturn<Promise<unknown>>, Fn<unknown, void>]

/** ## Task : Promise任务调度器,用于Promise任务管理 
@todo : 对Promise做Resulr封装📦
*/
export class Task {
  private limit: number
  private threads: Option<TaskUnit>[] = []
  private pool: Array<TaskUnit> = []

  constructor(thread: number) {
    this.limit = thread
    this.threads = Array.from({ length: thread }, () => None)
  }

  /* add_task : 新增Promise,要求返回值为AsyncResult */
  add_task<O, E>(
    PromiseFunc: FnReturn<AsyncResult<O, E>>,
    opts = {
      top: false /* 是否优先处理 */,
    }
  ): AsyncResult<O, E> {
    const { top = false } = opts
    const { promise, resolve } = Promise.withResolvers()

    if (top) this.pool.unshift([PromiseFunc, resolve])
    else this.pool.push([PromiseFunc, resolve])

    this.execute()
    return promise as AsyncResult<O, E>
  }

  /** ### execute : 执行器执行 */
  private execute() {
    if (this.pool.length === 0 || this.threads.length === 0) return
    if (this.threads.every((i) => i.is_some)) return

    const thunk = this.pool.shift()!

    const idx = this.threads.findIndex((i) => i.is_none)

    this.threads[idx] = Some(thunk)
    const [promise, resolve] = thunk

    promise()
      .then(resolve, (err) => UnexpectedError.err(err))
      .finally(() => {
        if (this.threads.at(idx) === undefined) return
        this.threads[idx] = None
        this.execute()
      })
  }
}

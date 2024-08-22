import {
  type Fn,
  type Debug,
  type Option,
  type Integer,
  type AsyncResult,
  type PromiseResolve,
  Some,
  None,
  UnexpectedError,
} from '@chzky/fp'
import { type TaskUnit, type TaskFunc, type TaskCB, TaskState } from './type.ts'

/** ## Task : Promise任务调度器,用于Promise任务管理 

*/
export class Task<T extends number> implements Debug {
  private threads: Option<TaskUnit>[] = [] // 线程执行池
  private pool: Array<TaskUnit> = [] // 任务池
  private state: TaskState = TaskState.RUNNING

  constructor(thread: Integer<T>) {
    this.threads = Array.from({ length: thread }, () => None)
  }

  /** SingleThread : 创建一个单线程执行队列,使用{@param tasks}作为初始化执行任务队列 */
  static SingleThread(tasks: Array<TaskFunc>): Task<1> {
    const task = new Task(1)
    tasks.forEach((i) => task.add_task(i))
    return task
  }

  /** ### `suspend` : 暂停任务队列,正在运行的任务会继续运行,之后的任务都将被暂停 */
  suspend(): void {
    this.state = TaskState.SUSPEND
  }

  /** ### `resume` : 恢复任务队列,继续执行任务队列 */
  resume(): void {
    this.state = TaskState.RUNNING
    Array(this.threads.length)
      .fill(0)
      .forEach(() => this.execute())
  }

  /** ### `clear` : 清空任务队列,正在运行的任务将会继续运行,之后的任务都将被清空 */
  clear(): void {
    this.pool = []
  }

  /* ###  `add_task` : 新增Promise,要求返回值为AsyncResult */
  add_task<O, E>(
    PromiseFunc: Fn<TaskCB, AsyncResult<O, E>>,
    opts = {
      top: false /* 是否优先处理 */,
    }
  ): AsyncResult<O, E> {
    const { top = false } = opts
    const { promise, resolve } = Promise.withResolvers()
    const task = [PromiseFunc, resolve, { percent: 0 }] as TaskUnit
    if (top) this.pool.unshift(task)
    else this.pool.push(task)

    this.execute()

    return promise as AsyncResult<O, E>
  }

  /** ### `execute` : 执行器执行 */
  private execute(): void {
    if (this.state === TaskState.SUSPEND) return /* 暂停任务 */
    if (this.pool.length === 0 || this.threads.length === 0) return /* 空任务 */
    if (this.threads.every((i) => i.is_some)) return /* 满任务 */

    const thunk = this.pool.shift()!

    const idx = this.threads.findIndex((i) => i.is_none)

    this.threads[idx] = Some(thunk)
    const [promise, resolve] = thunk

    let percent_os: number | undefined = 0
    const param = {
      percent: (call: Fn<number, number>): void => {
        thunk[2].percent = Math.max(Math.min(100, Math.max(0, call(percent_os!))), 0)
        percent_os = thunk[2].percent
      },
    }

    promise(param)
      .then(resolve, (err) => resolve(UnexpectedError.err(err)))
      .finally(() => {
        if (this.threads.at(idx) === undefined) return
        this.threads[idx] = None
        percent_os = undefined
        this.execute()
      })
  }

  info(): [string, string, string, ...Array<string>, string] {
    const running = this.threads.filter((i) => i.is_some)

    const lene = running
      .map((unit, idx) => {
        const [_, _a, { percent }] = unit.unwrap()
        const blen = Math.floor(percent / 5)
        return `Lane ${idx + 1} : ${'█'.repeat(blen)}${'.'.repeat(20 - blen)} : ${percent}%`
      })
      .join('\n')
    return [
      `------- %cTask%c<%c${this.threads.length}%c> : %c${this.state} %c------`,
      `        Pending Tasks : %c${this.pool.length}`,
      `        Running Tasks : %c${running.length}%c`,
      ...lene.split('\n'),
      `--------------------------------`,
    ]
  }

  /** ### `log` : 实现{@link Debug}接口 */
  log(): void {
    console.log(
      this.info().join('\n'),
      'color:#67C23A',
      'color:#fff',
      'color:#aa88e0',
      'color:#fff',
      `color:${this.state === TaskState.RUNNING ? '#67C23A' : '#F56C6C'}`,
      'color:#fff',
      'color:#F56C6C',
      'color:#67C23A',
      'color:#fff'
    )
  }
}

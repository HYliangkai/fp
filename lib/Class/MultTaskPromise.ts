import {AnyErr, Ok} from '../../mod.ts'
/** ## MultTaskPromise : 多任务Promise池 
  `任务模型`: 用于运行多个Promise任务,并限制并数量,当有任务完成时,会自动运行下一个任务
*/
export class MultTaskPromise {
  private task_count: number
  private now_run_count: number = 0
  private task_pool: {
    res: (value: unknown) => void
    task: () => Promise<any>
    rej: (reason?: any) => void
  }[]

  constructor(task_count = 2) {
    this.task_count = task_count
    this.task_pool = []
  }

  /** ### set_task_count : 设置任务并发数 , 必须为正整数 */
  public set_task_count(task_count: number): AnyResult<void> {
    return Number.isInteger(task_count) && task_count > 0
      ? ((this.task_count = task_count), Ok())
      : AnyErr('Error', 'task_count must be a positive integer')
  }

  /** ### add : 添加Promise任务进入 */
  public add(task: () => Promise<any>) {
    return new Promise((res, rej) => {
      this.task_pool.push({res, task, rej})
      this.run()
    })
  }

  private run() {
    while (this.now_run_count < this.task_count && this.task_pool.length > 0) {
      this.now_run_count++
      const the_task = this.task_pool.shift()
      if (!the_task) return
      const {res, task, rej} = the_task
      Promise.resolve(task())
        .then(res, rej)
        .finally(() => {
          this.now_run_count--
          this.run()
        })
    }
  }
}

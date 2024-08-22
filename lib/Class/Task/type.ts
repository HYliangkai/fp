import type{ AsyncResult, Fn, PromiseResolve } from '@chzky/fp'

export enum TaskState {
  SUSPEND = 'Suspend',
  RUNNING = 'Running',
}


export type TaskInfo = { percent: number }
export type TaskCB = {
  percent: Fn<Fn<number, number>, void>
}
export type TaskFunc = Fn<TaskCB, AsyncResult<unknown, unknown>>
export type TaskUnit = [TaskFunc, PromiseResolve, TaskInfo]
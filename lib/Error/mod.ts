import {Result} from '../../mod.ts'
export * from './matchError.ts'
/** ### 错误级别
+ Panic：最高级别，表示系统不可恢复的错误。
+ Fatal：次高级别，表示系统将在不久的将来停止运行。
+ Error：错误级别，表示发生了错误但不会导致系统停止运行。
+ Warn：警告级别，表示发生了意料之外的事情，但不是错误。
+ Info：信息级别，表示系统正常运行的有用信息。
+ Debug：调试级别，表示用于调试的信息。
 */
export type ErrorLevel = 'Debug' | 'Info' | 'Warn' | 'Error' | 'Fatal' | 'Panic'

export type AnyResult<T, E extends ErrorLevel = ErrorLevel> = Result<T, AnyError<E>>

export function panic(type: ErrorLevel = 'Panic', cause = 'error...'): never {
  throw new AnyError(cause, {
    name: 'panic funtion call',
    type: type,
  })
}

export class AnyError<T extends ErrorLevel = 'Error'> {
  public type: ErrorLevel
  protected name: string
  protected cause: string
  protected strack: string

  constructor(
    cause?: string,
    options?: {name?: string /** @Default - AnyError */; type: T /** @Default - Error */}
  ) {
    this.cause = cause || ''
    this.name = options?.name || 'AnyError'
    this.type = options?.type || 'Error'
    this.strack = new Error().stack || 'no stack'
  }

  static new<T extends ErrorLevel = 'Error'>(
    cause?: string,
    options?: {
      name?: string /** @Default - AnyError */
      type?: T /** @Default - Error */
    }
  ) {
    return new AnyError<ErrorLevel>(cause || '', {
      name: options?.name || 'AnyError', //@ts-ignore
      type: options?.type || 'Error',
    })
  }

  value() {
    return {type: this.type, name: this.name, cause: this.cause, strack: this.strack}
  }

  /** log error */
  log() {
    console.error(this.value())
  }

  /** call stack trace */
  strack_trace() {
    return this.strack
  }

  /** throw value */
  throw() {
    throw this.value()
  }
}

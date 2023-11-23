import * as colors from 'https://deno.land/std@0.207.0/fmt/colors.ts'
import {AsyncResult, Def, Result, match} from '../../mod.ts'
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
export type AsyncAnyResult<T, E extends ErrorLevel = ErrorLevel> = AsyncResult<T, AnyError<E>>

export function panic(type: ErrorLevel = 'Panic', cause = 'error...'): never {
  throw new AnyError(type, cause, 'panic')
}

/** ## AnyError : A unified type of error
  + type :  `AnyResult<T>` == `Result<T,ANyError<ErrorLevel>>`
  ### Example
  ```ts
  const result: AnyResult<number> = Date.now() % 2 === 0 ? Ok(1) : AnyError('Debug','test error')
  const res:number= result
  .map_error(({debug})=>{debug(()=>Ok(1))})
  .unwarp()
  assert(res === 1) // true
  ```
 */
export class AnyError<T extends ErrorLevel = 'Error'> {
  public type: ErrorLevel
  protected name: string
  protected cause: string
  protected strack: string

  constructor(
    type?: T /** @Default - Error */,
    cause?: string,
    name?: string /** @Default - AnyError */
  ) {
    this.cause = cause || ''
    this.name = name || 'AnyError'
    this.type = type || 'Error'
    this.strack = new Error().stack || 'no stack'
  }

  static new<T extends ErrorLevel = 'Error'>(
    type?: T /** @Default - Error */,
    cause?: string,
    name?: string /** @Default - AnyError */
  ) {
    return new AnyError<ErrorLevel>(type, cause, name)
  }

  value() {
    return {type: this.type, name: this.name, cause: this.cause, strack: this.strack}
  }

  /** format log error */
  log() {
    console.log(
      `------------------ ${colors.red('Error')} ------------------\n` +
        `${colors.green('*')} type : ${match(
          this.type,
          ['Error', colors.red],
          ['Warn', colors.yellow],
          ['Info', colors.blue],
          ['Debug', colors.green],
          ['Fatal', colors.cyan],
          ['Panic', colors.red],
          [Def, (item: string) => item]
        )(this.type)}\n` +
        `${this.name ? `${colors.yellow('*')} name : ${colors.bgWhite(this.name)}\n` : ''}` +
        `${this.cause ? `${colors.blue('*')} cause : ${this.cause}\n` : ''}` +
        `${colors.red('*')} strack : ${this.strack}\n`
    )
    debugger
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

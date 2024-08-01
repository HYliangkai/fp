import {
  type AnyResult,
  type Debug,
  type PartialEq,
  type Default,
  Err,
  match,
} from '../../../mod.ts'

/** ## ErrorInfo : 错误信息 */
type ErrorInfo = {
  type: ErrorLevel
  name: string
  cause: string
  strack: string
}

/** ## ErrorLevel : 错误级别
  + Panic：最高级别，表示系统不可恢复的错误。
  + Fatal：次高级别，表示系统将在不久的将来停止运行。
  + Error：错误级别，表示发生了错误但不会导致系统停止运行。
  + Warn：警告级别，表示发生了意料之外的事情，但不是错误。
  + Info：信息级别，表示系统正常运行的有用信息。
  + Debug：调试级别，表示用于调试的信息。

  @category Error
  */
export type ErrorLevel = 'Debug' | 'Info' | 'Warn' | 'Error' | 'Fatal' | 'Panic'
const ERRORLEVELS = ['Debug', 'Info', 'Warn', 'Error', 'Fatal', 'Panic'] as const
/** ## AnyError : 表示AnyError类型的错误
  @description
    + `type`：错误级别 - {@link ErrorLevel}
    + `cause`：错误原因
    + `name`：错误名称
  @example
  ```ts
  const err = AnyError.new('Error','test error')
  assert(err.type === 'Error')//Pass
  assert(err.cause === 'test error')//Pass
  assert(err.name === 'AnyError')//Pass
  ```
  @category Error
 */
export class AnyError<T extends ErrorLevel = 'Error'> implements Debug, PartialEq {
  public type: ErrorLevel
  protected name: string | symbol
  protected cause: string
  protected strack: string

  constructor(
    type?: T /** @Default - 'Error' */,
    cause?: string,
    name?: string | symbol /** @Default - AnyError */
  ) {
    this.cause = cause || ''
    this.name = name || 'AnyError'
    this.type = type || 'Error'
    this.strack = new Error().stack || 'no stack'
    if (!ERRORLEVELS.some((i) => i === this.type)) {
      throw new Error('ErrorLevel not found')
    }
  }

  /**
  实现{@link PartialEq}接口 ：  当一个错误的`type`&&`cause`&&`name`三者相同时可以认为是同一种错误
  @example
  ```ts
  const err1 = AnyError.new('Error','test error')
  const err2 = AnyError.new('Error','test error')
  assert(err1.eq(err2))//Pass
  ```
   */
  eq(other: this): boolean {
    return this.type === other.type && this.cause === other.cause && this.name === other.name
  }

  /** ## new : 实现{@link NewAble}接口 */
  static new<T extends ErrorLevel = 'Error'>(
    type?: T,
    cause?: string,
    name?: string
  ): AnyError<ErrorLevel> {
    return new AnyError<ErrorLevel>(type, cause, name)
  }

  /** ## err : 快速生成`Err`类型数据 */
  static err<T extends ErrorLevel = 'Error'>(
    type?: T,
    cause?: string,
    name?: string
  ): AnyResult<never, 'Error'> {
    return Err(new AnyError<ErrorLevel>(type, cause, name))
  }

  /** ## default : 实现{@link Default}接口 */
  static default(): AnyError<'Error'> {
    return this.new()
  }

  /** ### log : 实现{@link Debug}接口 */
  log(): void {
    const type_color = match(this.type)
      .case('Error', '#E5133A')
      .case('Info', '#909399')
      .case('Debug', '#67C23A')
      .case('Warn', '#E6A23C')
      .case('Fatal', '#BF062E')
      .case('Panic', '#840021')
      .done()
      .unwrap()

    console.log(
      `%c------------------ ${'Error'} ------------------\n` +
        `%c${'*'} %ctype   : %c${this.type}\n` +
        `${
          this.name
            ? `%c${'*'} %cname   : ${
                typeof this.name === 'symbol' ? this.name.description || 'symbol' : this.name
              }\n`
            : ''
        }` +
        `%c${this.cause ? `${'*'} %ccause  : ${this.cause}\n` : ''}` +
        `%c${'*'} %cstrack : ${this.strack}\n` +
        `%c------------------ ${'End'} ------------------\n`,
      'color:#F56C6C',
      'color:#fff',
      'color:#409EFF',
      `color:${type_color}`,
      'color:#fff',
      'color:#67C23A',
      'color:#fff',
      'color:#E6A23C;',
      'color:#fff',
      'color:#909399',
      'color:#F56C6C'
    )
  }

  /** ### value : return format value */
  value(): ErrorInfo {
    return {
      type: this.type,
      name: typeof this.name === 'symbol' ? this.name.description || 'symbol' : this.name,
      cause: this.cause,
      strack: this.strack,
    }
  }

  /** call stack trace */
  stack_trace(): string {
    return this.strack
  }

  /** throw value with format*/
  throw(): never {
    throw this.value()
  }
}

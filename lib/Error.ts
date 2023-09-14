/** 错误类型集锦 */

/** 用于跳出嵌套的执行栈的类型,其实不是错误类型 */
export class BackTrack<T> extends Error {
  public return_val: T
  constructor(val: T) {
    super()
    this.return_val = val
  }
}

/** 空错误,常用在Option中空情况的抛异 */
export class NullError extends Error {
  constructor(msg: string = 'Null Error') {
    super(msg)
  }
}

/** 数据格式错误 */

export class DataFormatError extends Error {}

/** 常规错误 */

/** 判断函数 */
export const is_data_format_error = (val: unknown): val is DataFormatError =>
  val instanceof DataFormatError
export const is_back_track = <T>(val: unknown): val is BackTrack<T> =>
  val instanceof BackTrack
export const is_null_error = (val: unknown): val is NullError =>
  val instanceof NullError

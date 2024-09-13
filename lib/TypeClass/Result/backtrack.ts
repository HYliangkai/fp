export class BackTrack<T> {
  public return_val: T
  constructor(val: T) {
    this.return_val = val
  }

  /** ### `new` : 实现{@link New}接口 */
  static new<T>(val: T): BackTrack<T> {
    return new BackTrack(val)
  }

  /** ### `from` : 实现{@link From}接口 */
  static from<T>(val: T): BackTrack<T> {
    return new BackTrack(val)
  }
}

/** 解决result()中嵌套过深无法返回的问题,可以作为result()函数中的return使用 */
export function backtrack<T>(val: T): void {
  throw new BackTrack(val)
}

export class BackTrack<T> {
  public return_val: T
  constructor(val: T) {
    this.return_val = val
  }
}

/** 解决result()中嵌套过深无法返回的问题,可以作为result()函数中的return使用 */
export function backtrack<T>(val: T): void {
  throw new BackTrack(val)
}

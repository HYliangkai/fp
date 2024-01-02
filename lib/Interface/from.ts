/** ## From : 提供一个转化接口 */
export interface From<T> {
  from(val: T): this
}

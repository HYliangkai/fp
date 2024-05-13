/** ## Eq : 提供一个不同类型数据相等性判断的功能
 */

export interface Equal<A> {
  equals(val: A): boolean
}

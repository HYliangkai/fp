/** ## `Sum` : 应用于可迭代数据,表示迭代的元素可进行求和
@category Interface
 */
export interface Sum<S> extends Iterable<S> {
  sum: () => S
}

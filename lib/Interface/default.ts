/** 提供类型的默认数据 */

/** 默认数据 */
export interface Default<T> {
  default: () => Omit<T, 'default'>
}

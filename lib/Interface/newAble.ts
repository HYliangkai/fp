/** ## NewAble : 允许使用new函数来创建实例 */
export interface NewAble {
  new: (...args: unknown[]) => this
}

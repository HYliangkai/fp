/** ## Debug : 自定义debug接口 */
export interface Debug<T = void> {
  readonly log: () => T
}

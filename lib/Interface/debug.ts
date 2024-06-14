/** ## Debug : 自定义debug接口 
@category Interface
*/
export interface Debug<T = void> {
  readonly log: () => T
}

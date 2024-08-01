/** ## As : 提供一个转换成另一个数据类型的能力
`As` 和 `Into` 的区别在于，`As` 只需要单方面实现即可完成转换，而 `Into`需要实现方先实现`Form`接口，然后才能实现`Into`接口  
即 `Into`通常表示一种双向转换，而`As`只是单向转换

 */
export interface As<T, K = unknown> {
  as(flag?: K): T
}

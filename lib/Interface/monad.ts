/** ## [Monad](https://netcan.github.io/2020/09/30/%E8%AF%A6%E8%A7%A3%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B%E4%B9%8BMonad/) : 一个类型构造子（下面简称M），定义了两个操作：
+ `unit :: t -> M t`，将类型 T 包装 成 Monad 类型，也被常常称为 return/pure/lift 操作
+ `bind :: M a -> (a -> M b) -> M b`，bind 组合子，输入一个 M a 和一个函数然后返回 M b，输入的函数可以拿到 被包装 的类型 a，进行变换返回M b。  


结果是`unit`(唯一)并且可以`bind`(链式调用)的类型构造子即为Monad
 */
export interface Monad<A, B> {
  readonly _tag: A|B
}

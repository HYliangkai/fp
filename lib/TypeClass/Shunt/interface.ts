import type { Monad, mainstream_tag, reflux_tag } from '@chzky/fp'

/** ## `Shunt` : 一个适用于`pipe`函数的分流结构
用于解决pipe函数中不能及时返回数据的问题
### Feature
是将`主流`和`回流`数据进行分开:
+ 如果数据是`主流数据`,pipe将进行解包并向下执行
+ 如果是`回流数据`,pipe将进行解包并直接将数据作为执行结果进行返回 



@example Usage
```ts
```
*/
export interface Shunt<M, B> extends Monad<typeof mainstream_tag, typeof reflux_tag> {
  unwrap(): M | B
}

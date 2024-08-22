import type {
  As,
  Copy,
  Fn,
  Option,
  NonZeroPositiveInteger,
  Into,
  Peekable,
  Result,
  AnyResult,
  OrdSelf,
  OrdResult,
  Sum,
} from '@chzky/fp'
import type { VectorInfiniteLengthError, VertorUsedError } from './core.ts'
export enum VectorState {
  DONE /* 已进行过消费 */,
  PEND /* 未进行过消费 */,
}

export enum VectorSize {
  INFINITY /* 无限长度 */,
  LIMITED /* 有限长度 */,
  UNKNOWN /* 无法界定 */,
}

/** ## `Vector` : 具有[惰性求值](https://zh.wikipedia.org/zh-hant/%E6%83%B0%E6%80%A7%E6%B1%82%E5%80%BC)的可迭代数据结构
+ `Vector`是一种具有惰性求值的可迭代数据结构,其内部的数据只有在被消费的时候才会进行计算.可以有效的减少不必要的计算,提高性能
+ 相比Array增加了许多的链式操作API,可以方便的对数据进行处理
+ 允许创建无限列表

### 性能场景
1. 对于数据量大但是需求量少的场景有着很好的性能优势,常见的场景譬如:列表分页处理,数据筛选等
2. 如果此时一个数据需要完全遍历才能得到结果,那么`Vector`的性能会比普通的迭代器差

@example Usage : 惰性求值的`Vector`可以有效的减少不必要的计算,提高性能
```ts
  // Test Data
  const name_r = ['jio', 'jiojio', 'dio', 'diojio']
  const address = ['防抖华云', '公园花园', '秀琼花园']
  const arr = Array.from({ length: 100000 }, (_, i) => ({
    name: name_r[i % name_r.length],
    id: i,
    address: address[i % address.length],
    is: false,
  }))

  // 使用 take()进行惰性求值
  Vec(arr)
    .map((i) => {
      if (i.id % 2 === 0) i.is = true
      return i
    })
    .filter((i) => i.name == 'dio')
    .filter((i) => i.is)
    .drop(10)
    .map((i) => ({ ...i, name: i.address + '-' + i.name }))
    .take(500)
    .collect() //==> 514.72 µs/iter

  // 使用迭代器方法进行求值
  arr
    .map((i) => {
      if (i.id % 2 === 0) i.is = true
      return i
    })
    .filter((i) => i.name == 'dio')
    .filter((i) => i.is)
    .slice(10)
    .map((i) => ({ ...i, name: i.address + '-' + i.name }))
    .slice(500) //==> 5.16 ms/iter
```
@category Class
*/
export interface Vector<T>
  extends As<Array<T>, 'array'>,
    Copy,
    Sum<T>,
    Into<Peekable<T, Iterator<T>>, 'peek'> {
  /** ### `state` : Vector所属状态 */
  state: VectorState
  /** ### `size` : Vector可能的最大长度状态 */
  size: VectorSize

  /** @PEND */

  /** ### `take` : 只取前n个元素 
  @benchkey : 当迭代的数据越多,同时拿取的数据越少,`take`的性能越好
  */
  take: <N extends number>(num: NonZeroPositiveInteger<N>) => Vector<T>

  /** ### `map` : 元素重新映射 */
  map: <R>(cb: Fn<T, R>) => Vector<R>

  /** ### `filter` : 元素过滤  */
  filter: (cb: Fn<T, boolean>) => Vector<T>

  /** ### `filter_map` : 过滤并映射
  + 返回值为`None`则进行过滤;返回值为`Some<R>`则进行映射 */
  filter_map: <R>(cb: Fn<T, Option<R>>) => Vector<R>

  /** ### `inspect` : 遍历元素 */
  inspect: (cb: Fn<T, unknown>) => Vector<T>

  /** ### `drop` : 跳过前n个元素 */
  drop: <N extends number>(num: NonZeroPositiveInteger<N>) => Vector<T>

  /** ### `skip_by` : 取符合步进规律的元素 */
  step_by: <I extends number>(step: NonZeroPositiveInteger<I>) => Vector<T>

  /** ### `chain` : 将两个Vector进行链接 */
  chain: <R>(other: Vector<R>) => Vector<R | T>

  /** ### `zip` : 将两个Vector进行拼接,返回的长度以最小的长度为准,多余的长度将被裁剪掉 */
  zip: <R>(other: Vector<R>) => Vector<[T, R]>

  /** ### `unzip` : `zip`函数的相反操作,将一个`Vector<[A,B]>`拆分成两个`[Vector<A>, Vector<B>]`  */
  unzip: () => T extends [infer A, infer B] ? [Vector<A>, Vector<B>] : never

  /** ### `cycle` : 将数据进行无限循环(遍历到末尾然后从头开始继续遍历) */
  cycle: () => Vector<T>

  /** ### `interleave` : 将R在Vector中进行交叉插入 */
  intersperse: <R>(separator: R) => Vector<T | R>

  /** @DONE */

  /** ### `collect` : 将Vector转换为数组
  @done : 此操作会将会消费Vector
   */
  collect: () => Array<T>

  /** ### `each` : 遍历元素 
  @done : 此操作会将会消费Vector
  */
  each: (cb: Fn<T, unknown>) => void

  /** ### `try_collect` : 对于可能出错的情况collect进行封装
  @done : 此操作会将会消费Vector
  */
  try_collect: () => AnyResult<Array<T>>

  /** ### `collect_into` : 将Vector转换为目标数组并追加到`target`数组上
  @done : 此操作会将会消费Vector
  */
  collect_into: <R>(target: Array<R>) => Array<R | T>

  /** ### `reduce` : 将Vector进行reduce操作 
  @done : 此操作会将会消费Vector
  */
  reduce<R>(cb: (acc: R, cur: T) => R, init: R): R
  reduce(cb: (acc: T, cur: T) => T, init: T): T

  /** ### `join` : 将Vector按照separator转化为string ; 如果长度是无限的就返回Err
  @done : 此操作会将会消费Vector
  */
  join: (separator: string) => Result<string, VectorInfiniteLengthError | VertorUsedError>

  /** ### `partition` : 将Vector按照条件进行分割
  @done : 此操作会将会消费Vector
  */
  partition: (cb: Fn<T, boolean>) => [Array<T>, Array<T>]

  /** ### `next_chunk` : 消费并获取下一个元素
  @done : 此操作会将会消费Vector
  */
  next_chunk: () => Option<T>

  /** ### `position` : 返回满足条件的元素的位置
  @done : 此操作会将会消费Vector
  */
  position: (predicate: T) => Option<number>

  /** ### `last` : 返回Vector最后一个元素
  @done : 此操作会将会消费Vector
  */
  last: () => Option<T>

  /** ### `min` : 返回比较结果后最小的元素
  + 要求 : `T`实现`OrdSelf`
  @done : 此操作会将会消费Vector
  */
  min: () => T extends OrdSelf<T> ? T : never

  /** ### `min_by` : 根据cb返回比较结果后最小的元素
  @done : 此操作会将会消费Vector
  */
  min_by: (cb: (now: T, min: T) => OrdResult) => T

  /** ### `max` : 返回比较结果后最大的元素
  + 要求 : `T`实现`OrdSelf` 
  @done : 此操作会将会消费Vector
  */
  max: () => T extends OrdSelf<T> ? T : never

  /** ### `max_by` : 返回比较结果后最大的元素
  @done : 此操作会将会消费Vector
   */
  max_by: <R>(cb: Fn<T, OrdResult>) => T

  /** ### `find` : 生成的第一个满足提供的测试函数的元素。如果没有值满足测试函数，则返回 None
  @done : 此操作会将会消费Vector
   */
  find: (cb: Fn<T, boolean>) => Option<T>

  /** ### `every` : 如果数组中的每个元素都满足提供的测试函数，则返回 true，否则返回 false
  @done : 此操作会将会消费Vector
  */
  every: (cb: Fn<T, boolean>) => boolean
  /** ### `some` : 如果数组中至少有一个元素满足提供的测试函数，则返回 true，否则返回 false
  @done : 此操作会将会消费Vector
  */
  some: (cb: Fn<T, boolean>) => boolean

  /** ### `sum` : 返回Vector的和,只有当`T`为number类型的时候才生效
  @done : 此操作会将会消费Vector
  */
  sum: () => T extends number ? T : never

  /** ### `nth` : 返回Vector的第n个元素 */
  nth: (n: number) => Option<T>

  /**  ### `size_hint` : 返回`Vertor`剩余长度的范围
  返回的结果为: `[lower, upper]` ,表示一个剩余长度范围. 其中`lower`为迭代器的最低长度,`upper`为`Option<number>`类型,表示迭代器的最大长度,如果为`None`则表示迭代器长度为无限长度
  + 对于任意`Vertor`,其`size_hint`返回的结果都满足`[0,None]`
   */
  size_hint: () => [number, Option<number>]

  /** ### `count` : 返回`Vector`的长度 ,如果长度为无限则返回`Infinity`*/
  count: () => number

  /** ### `clone` : 克隆一个`Vector`,克隆的`Vector`其消费状态也会被克隆 */
  clone: () => Vector<T>

  /** ### `add_generator` : 增加自定义的生成器*/
  add_generator: <R>(gencb: Fn<Generator<T>, Generator<R>>) => Vector<R>

  /** ### `stream` : 流式遍历,根据回调判断是否加载下一条数据
  @example Usage
  ```ts
  const seq = assert_sequence()
  await Vec([1, 2, 3, 4, 5]).stream((i, next) => {
    setTimeout(() => {
      seq(i)
      next()
    }, 500)
  })
  ```
  @done : 此操作会将会消费Vector
  */
  stream: (cb: (item: T, next: Fn<void, void>) => unknown) => Promise<void>

  [Symbol.iterator](): Generator<T>
}

import type { left_tag, right_tag, As, Option, Result, Fn, Monad } from '@chzky/fp'

type EitherIntoFlag = 'option' | 'result'

/** ## Either
`Either<L, R>` 表示通用的二元类型，它的值可以是`left`或者`right`。  
比较常见的用法是用来表示一个值可能是两种类型中的一种。  
一个经典的例子是`boolean`类型，它的值可能是`true`或者`false`。
*/
export interface Either<L, R>
  extends Monad<typeof left_tag, typeof right_tag>,
    As<boolean, 'boolean'> {
  readonly _tag: typeof left_tag | typeof right_tag

  readonly is_left: boolean
  readonly is_right: boolean

  /** ### merge : 获取值 */
  merge: () => L | R

  /** ### unwrap : 获取`left`值,如果不存在抛出异常 */
  unwrap_left: () => L
  /** ### unwrap : 获取`right`值,如果不存在抛出异常 */
  unwrap_right: () => R
  /** ### unwrap_lor : 获取`left`值,如果不存在使用`or`替换 */
  unwrap_lor: <O>(or: O) => L | O
  /** ### unwrap_ror : 获取`right`值,如果不存在使用`or`替换 */
  unwrap_ror: <O>(or: O) => R | O

  /** ### exchange : 交换`left`值`right`值  */
  exchange: () => Either<R, L>

  /** ### right_do : 如果是`right`值,执行`callback` */
  right_do: Fn<Fn<R, void>, void>
  /** ### left_do : 如果是`left`值,执行`callback` */
  left_do: Fn<Fn<L, void>, void>
  /** ### match : `left`值`right`值执行匹配回调 */
  match: (left: Fn<L, void>, right: Fn<R, void>) => void

  /** ## into : 实现{@link Into}接口
  转换规则:
  + `Left(L)`  -> `Some<L>` | `Ok<L>`
  + `Right(R)` -> `None` | `Err<R>`
  */
  into<R extends EitherIntoFlag>(
    flag: R
  ): R extends 'option' ? Option<L> | Option<R> : R extends 'result' ? Result<L, R> : never

  /** ## as : 实现{@link As}接口
  转换规则:
  + `Left(L)`  -> `true`
  + `Right(R)` -> `false`
   */
  as<R extends 'boolean'>(flag: R): R extends 'boolean' ? boolean : never
}

import {
  Condition,
  Def,
  Fn,
  JudeCondition,
  None,
  Option,
  PartialEq,
  Some,
  implements_equal,
  implements_partial_eq,
} from '../../mod.ts'

/** ## Pattern : 链式调用的模式匹配

@category Function
*/
// interface Pattern<T, R> {
//   /** ### when : 进行其中一个的模式匹配处理 */
//   when<V>(item: MatchingItem<T>, value: V): Pattern<T, R | V>

//   /** ### done : 获取匹配结果 */
//   done(): R
// }

class Pattern<T, R = never> {
  constructor(private value: T, private pattern: Array<[Condition<any>, any]> = []) {}

  when<V>(item: Condition<T | typeof Def>, value: V): Pattern<T, R | V> {
    this.pattern.push([item, value])
    return new Pattern<T, R | V>(this.value, this.pattern)
  }

  done(): Option<R> {
    let def = None
    for (const [condition, result] of this.pattern) {
      if (condition === this.value) return Some(result)
      if (typeof condition === 'function' && (condition as JudeCondition<any>)(this.value)) return result

      const partial =
        implements_partial_eq(this.value) && implements_partial_eq(condition) && (this.value as PartialEq)['eq'](condition)

      const equal = implements_equal(this.value) && implements_equal(condition) && this.value['equals'](condition)

      if (partial || equal) return result
    }

    return def
  }
}

export function pattern<T>(value: T): Pattern<T> {
  return new Pattern(value)
}

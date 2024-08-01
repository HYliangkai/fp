import {
  None,
  option,
  match_return_tag,
  implements_equal,
  implements_partial_eq,
  type Option,
  type Condition,
  type JudeCondition,
} from '../../mod.ts'

type CaseInfo = {
  immediate: boolean /* 如果case是个函数是否立刻执行 */
}
export class Matcher<T, R = never> {
  private cases: Array<[Condition<T> | Array<Condition<T>>, any, CaseInfo]>
  private match_value: T

  constructor(
    match_value: T,
    cases: Array<[Condition<T> | Array<Condition<T>>, R, CaseInfo]> = []
  ) {
    this.cases = cases
    this.match_value = match_value
  }

  /** ### case : 条件匹配
  @param condition : 匹配条件 
  能作为pattern的条件有四种:
  1. 全等 : 直接`===`比较
  2. 函数 : 函数返回值为`true`时匹配
  3. 实现了PartialEq的数据结构 : 调用`eq`方法进行比较
  4. 实现了Equal的数据结构 : 调用`equals`方法进行比较
  @param value : 匹配结果,直接返回
   */
  case<V>(condition: Condition<T>, value: V): Matcher<T, V | R> {
    this.cases.push([condition, value, { immediate: false }])
    return new Matcher(this.match_value, this.cases)
  }

  /** ### when : 条件匹配,用于解决返回值是个函数的情况,能直接执行函数
  @param condition : 匹配条件
  @param call_back : 执行函数,函数返回值即为匹配结果值
  @example
  ```ts
  const result = match('JioJio')
    .case('dio', false)
    .when('diojio', functor<boolean>`false`)
    .when('JioJio', () => true)
    .done()
    .unwrap()
  assert(result)
  ```
   */
  when<U>(condition: Condition<T>, call_back: (value?: T) => U): Matcher<T, U | R> {
    this.cases.push([condition, call_back, { immediate: true }])
    return new Matcher(this.match_value, this.cases)
  }

  /** ### some : 多个条件匹配单个结果
  @param conditions : 匹配条件
  @param value
  @example 
  ```ts
  const name = 'jiojio'
  const age = match(name)
    .group(
      ['jiojio'(name) => name === 'dio'],
      20
    )
    .done()
  assert(age === 18) // true
  ```
  */
  some<V>(conditions: Array<Condition<T>>, value: V): Matcher<T, V | R> {
    this.cases.push([conditions, value, { immediate: false }])
    return new Matcher(this.match_value, this.cases)
  }

  /** ###  */

  /** ### done :  收集match结果
  @param def : 默认值,如果不传递默认值,则返回`Option<R>`,否则返回`R|V`
  */
  done<V = undefined>(def = undefined as V): V extends undefined ? Option<R> : R | V {
    for (const index in this.cases) {
      const [condition, result, caseinfo] = this.cases[index]
      if (typeof condition === 'object' && Array.isArray(condition)) {
        if (
          condition.some(
            (c) => matching(this.match_value, c, match_return_tag) === match_return_tag
          )
        )
          return match_return('Some', def, this.match_value, result, caseinfo)
      } else {
        if (matching(this.match_value, condition, match_return_tag) === match_return_tag)
          return match_return('Some', def, this.match_value, result, caseinfo)
      }
    }
    return match_return('None', def, this.match_value, undefined, { immediate: false })
  }
}

/** 核心匹配语句 */
function matching<T>(match_value: any, condition: Condition<T>, flag: symbol): symbol | null {
  if (condition === match_value) return flag
  if (typeof condition === 'function' && (condition as JudeCondition<any>)(match_value) === true)
    return flag
  if (
    implements_partial_eq(match_value) &&
    implements_partial_eq(condition) &&
    match_value['eq'](condition as any) === true
  )
    return flag
  if (implements_equal(match_value) && match_value['equals'](condition) === true) return flag
  return null
}
/** 返回match的值 */
function match_return(
  type: 'Some' | 'None',
  def: any,
  match_value: any,
  result: any,
  caseinfo: CaseInfo
): any {
  return type === 'Some'
    ? def === undefined
      ? option(match_result(match_value, result, caseinfo))
      : result
    : def === undefined
    ? None
    : def
}

function match_result(match_value: any, result: any, info: CaseInfo): any {
  return info.immediate ? result(match_value) : result
}

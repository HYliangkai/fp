import {
  option,
  Copy,
  match_return_tag,
  implements_equal,
  implements_partial_eq,
  IllegalOperatError,
  type Option,
  type Condition,
  type JudeCondition,
} from '@chzky/fp'

enum ErrorCase {
  WHRN_TYPE_ERROR = 'Match.when() second argument must be a function',
  NO_ARRAY = 'Must pass in an array',
  EMPTY_ARRAY = 'Array is empty',
}

type CaseInfo = {
  immediate: boolean /* 如果case是个函数是否立刻执行 */
  every?: boolean /* 用于区分some函数还是every函数的标志 */
}
export class Matcher<T, R = never> implements Copy {
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
    if (typeof call_back !== 'function') throw new TypeError(ErrorCase.WHRN_TYPE_ERROR)
    this.cases.push([condition, call_back, { immediate: true }])
    return this
  }
  /** ### some : 多个条件,只要满足一项即匹配结果
  @param conditions : 匹配条件
  @param value
  @example 
  ```ts
  const pattern1 = zod.number().min(0).max(10)
  const pattern2 = zod.number().min(-10).max(-2)

  const res = match(10)
    .some([zod.validate(pattern1), zod.validate(pattern2)], true)
    .done(false)

  assert(res)
  ```
  */
  some<V>(conditions: [Condition<T>, ...Array<Condition<T>>], value: V): Matcher<T, V | R> {
    if (!Array.isArray(conditions)) throw new TypeError(ErrorCase.NO_ARRAY)
    if (conditions.length === 0) throw new IllegalOperatError(ErrorCase.EMPTY_ARRAY)
    this.cases.push([conditions, value, { immediate: false, every: false }])
    return this
  }

  /** ### every : 多个条件,需要同时具备才能匹配结果 
  @example Usage
  ```ts
  assertThrows(() => {
    //@ts-ignore : every必须传入一个有内容的数组,否则会报错
    match('jiojio').every([], true)
  })

  const res = match('jiojio')
    .every(
      [
        reversal<String, 'startsWith'>('startsWith', 'jio'),
        reversal<String, 'endsWith'>('endsWith', 'dio'),
      ],
      'jiodio'
    )
    .every(
      [
        reversal<String, 'startsWith'>('startsWith', 'jio'),
        reversal<String, 'endsWith'>('endsWith', 'jio'),
      ],
      'jiojio'
    )
    .done()
    .unwrap()  
  ```
  */
  every<V>(conditions: [Condition<T>, ...Array<Condition<T>>], value: V): Matcher<T, V | R> {
    if (!Array.isArray(conditions)) throw new TypeError(ErrorCase.NO_ARRAY)
    if (conditions.length === 0) throw new IllegalOperatError(ErrorCase.EMPTY_ARRAY)
    this.cases.push([conditions, value, { immediate: false, every: true }])
    return this
  }

  /** ### rematch : 获取match的值,进行重新匹配 --> 用于解决多分支匹配问题 
  @example Usage
  ```ts
  const match_str = 'jiojio-dio-is-a-dog'

  //functional expression
  const resfp = match(match_str)
    .when(
      (v) => v.startsWith('jiojio'),
      (v) => v?.replace('jiojio', '')
    )
    .when(
      (v) => v.startsWith('dio'),
      (v) => v?.replace('dio', '')
    )
    .rematch() // 结果进行重新匹配
    .when(reversal('as', 'boolean'), (v) => v?.unwrap().replace('-dio-is-a-', ''))
    .done()
    .unwrap()

  // procedural
  let respd = ''
  if (match_str.startsWith('jiojio')) {
    respd = match_str.replace('jiojio', '')
  } else if (match_str.startsWith('dio')) {
    respd = match_str.replace('dio', '')
  }
  if (respd !== '') {
    respd = respd.replace('-dio-is-a-', '')
  }

  assertEquals(resfp, respd)  
  ```
  */
  rematch<V = undefined>(def = undefined as V): Matcher<V extends undefined ? Option<R> : R | V> {
    return new Matcher(this.done(def))
  }

  /** ### clone : 实现{@link Copy}接口,创建一个新的匹配模式
  ```ts
  const cola = match('jiojio').case('dio', 'isdio')

  // New Matcher
  const colb = cola.clone().case('jiojio', 'isjiojio').done().unwrap()
  assert(colb === 'isjiojio')

  // Original Matcher
  assert(cola.done().unwrap_or(true))  
  ```
  */
  clone(): Matcher<T, R> {
    return new Matcher(this.match_value, this.cases)
  }

  /** ### done : 获取match结果
  @param def : 默认值,如果不传递默认值,则返回`Option<R>`,否则返回`R|V` 
  @tips 如果进行匹配的值是`underfind`或`null`,会直接返回`None`/`def`
  */
  done<V = undefined>(def = undefined as V): V extends undefined ? Option<R> : R | V {
    if (this.match_value !== undefined && this.match_value !== null) {
      for (const index in this.cases) {
        const [condition, result, caseinfo] = this.cases[index]

        if (Array.isArray(condition)) {
          /** @case : some/every 函数处理 */
          const { every = null } = caseinfo
          if (
            (every &&
              condition.every(
                (c) => matching(this.match_value, c, match_return_tag) === match_return_tag
              )) ||
            (!every &&
              condition.some(
                (c) => matching(this.match_value, c, match_return_tag) === match_return_tag
              ))
          ) {
            return match_return('Some', def, this.match_value, result, caseinfo)
          }
        } else {
          if (matching(this.match_value, condition, match_return_tag) === match_return_tag)
            return match_return('Some', def, this.match_value, result, caseinfo)
        }
      }
    }
    /** 兜底处理 */
    return match_return('None', def, this.match_value, undefined, { immediate: false })
  }
}

/** 核心匹配语句 */
function matching<T>(match_value: any, condition: Condition<T>, flag: symbol): symbol | null {
  /** @case1 : 全等 */
  if (condition === match_value) return flag

  /** @case2 : 函数回调结果为true */
  if (typeof condition === 'function' && (condition as JudeCondition<any>)(match_value) === true) {
    return flag
  }

  /** @case3 : 实现PartialEq */
  if (
    implements_partial_eq(match_value) &&
    implements_partial_eq(condition) &&
    match_value['eq'](condition as any) === true
  )
    return flag

  /** @case4 : 实现Equal */
  if (implements_equal(match_value) && match_value['equals'](condition) === true) return flag

  return null
}

/** 返回match的值 */
function match_return(
  type: 'Some' | 'None',
  def: any /* 默认值 : 用户判断是否返回option还是解包后类型 */,
  match_value: any,
  result: any,
  caseinfo: CaseInfo
): any {
  return def === undefined
    ? option(type === 'Some' ? match_result(match_value, result, caseinfo) : null)
    : type === 'Some'
    ? match_result(match_value, result, caseinfo)
    : def
}

/** 解析配置信息`caseinfo`并生成正确的返回值 */
function match_result(match_value: any, result: any, info: CaseInfo): any {
  return info.immediate ? result(match_value) : result
}

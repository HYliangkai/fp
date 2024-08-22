import {
  type Fn,
  type Condition,
  type Copy,
  type Debug,
  type NonEmptyArr,
  type Option,
  zod,
  IllegalOperatError,
  match_return_tag,
} from '@chzky/fp'
import { type_protect, matching, match_return } from './core.ts'
import { type CaseInfo, ErrorCase } from './type.ts'

export class Matcher<T, R = never> implements Copy, Debug {
  private cases: Array<[Condition<T> | Array<Condition<T>>, any, CaseInfo]>
  private match_value: T

  constructor(
    match_value: NonNullable<T>,
    cases: Array<[Condition<T> | Array<Condition<T>>, R, CaseInfo]> = []
  ) {
    type_protect(match_value)

    this.cases = cases
    this.match_value = match_value
  }

  /** @matching */

  /** ### case : 条件匹配
  @param condition : 匹配条件 
  能作为pattern的条件有四种:
  1. 全等 : 直接`===`比较
  2. 函数 : 函数返回值为`true`时匹配
  3. 实现了PartialEq的数据结构 : 调用`eq`方法进行比较
  4. 实现了Equal的数据结构 : 调用`equals`方法进行比较
  @param value : 匹配结果,直接返回
   */
  case<V>(condition: Condition<T>, value: NonNullable<V>): Matcher<T, V | R> {
    type_protect(value)

    this.cases.push([condition, value, { immediate: false }])
    return this
  }

  /** ### when : 条件匹配,用于解决返回值是个函数的情况,能直接执行函数
  @param condition : 匹配条件
  @param call_back : 执行函数,函数返回值即为匹配结果值 - 为了匹配能正确获取结果,函数必须返回一个值;如果实在没有需要返回的值,使用{@link Default.default()}包装表示此匹配无返回值
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
  when<U>(condition: Condition<T>, call_back: Fn<T, NonNullable<U>>): Matcher<T, U | R> {
    if (!zod.function().safeParse(call_back).success) throw new TypeError(ErrorCase.WHRN_TYPE_ERROR)

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
  some<V>(
    conditions: [Condition<T>, ...Array<Condition<T>>],
    value: NonNullable<V>
  ): Matcher<T, V | R> {
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
  every<V>(conditions: NonEmptyArr<Condition<T>>, value: NonNullable<V>): Matcher<T, V | R> {
    if (!Array.isArray(conditions)) throw new TypeError(ErrorCase.NO_ARRAY)
    if (conditions.length === 0) throw new IllegalOperatError(ErrorCase.EMPTY_ARRAY)
    this.cases.push([conditions, value, { immediate: false, every: true }])
    return this
  }

  /** @result */

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
  rematch<V = undefined>(
    def = undefined as V
  ): Matcher<V extends undefined | null ? Option<R> : R | V> {
    return new Matcher(this.done(def)!)
  }

  /** ### `done_else` : 获取结果,如果没有结果使用`fn(match_value)`替代 
  @tips 如果进行匹配的结果是`underfind`或`null`,也会直接返回`fn(match_value)`的结果
  ```ts
  ```
  */
  done_else<RR>(fn: Fn<T, RR>): R | RR {
    return this.done().unwrap_or_else(() => fn(this.match_value))
  }

  /** ### `done` : 获取match结果
  @param def : 默认值,如果不传递默认值,则返回`Option<R>`,否则返回`R|V` 
  @tips 如果进行匹配的值是`underfind`或`null`,会直接返回`None`/`def`
  */
  done<V = undefined>(def = undefined as V): V extends undefined | null ? Option<R> : R | V {
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

  /** @implacement */

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
    return new Matcher(this.match_value!, this.cases)
  }

  /** ### debug : 实现{@link Debug}接口,用于输出匹配信息 */
  log: () => void = () => {
    console.log(`---------------Match-----------------`)
    console.log('Match : ', this.match_value)
    this.cases.forEach(([condition, value]) => {
      console.log(`-  Case : ${condition}`)
      console.log(`-- Value: ${value}`)
    })
    console.log(`-------------Match  End---------------`)
  }
}

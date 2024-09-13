import {
  type State,
  type Condition,
  type JudeCondition,
  zod,
  option,
  implements_equal,
  implements_partial_eq,
} from '@chzky/fp'
import type { CaseInfo } from './type.ts'

/** 核心匹配语句 */
export function matching<T>(
  match_value: any,
  condition: Condition<T>,
  flag: symbol
): symbol | null {
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
export function match_return(
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
export function match_result(match_value: any, result: any, info: CaseInfo): any {
  return info.immediate
    ? info.state
      ? result((match_value as State<any, any>).effect())
      : result(match_value)
    : result
}

/** 类型守卫 */
export function type_protect(value: unknown): void | never {
  if (zod.undefined().or(zod.null()).safeParse(value).success)
    throw new TypeError('match value cannot be null or undefined')
}

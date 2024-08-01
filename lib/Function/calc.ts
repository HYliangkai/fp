import { Err, type Fn, NaNError, Ok, type Result, pipe } from '../../mod.ts'
import { a_calc } from '../Ext/aCalc.ts'

type DecimalLimit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type OtherFM = ',' | '/' | '+' | '%' | '!e' | '!n' | '!u' | '~-' | '~+' | '~5' | '~6'

type Fmt =
  | `>${DecimalLimit}`
  | `<${DecimalLimit}`
  | `=${DecimalLimit}`
  | `>=${DecimalLimit}`
  | `<=${DecimalLimit}`
  | OtherFM
type FillData =
  | Record<number | string, number | string>
  | Array<Record<number | string, number | string>>
type CalcConf<T> = {
  fmt?: Array<Fmt> /* 格式化数组 */
  memo?: boolean /* 是否开启结果缓存 */
  unit?: boolean /* 是否带上单位进行计算 */
  error?: Result<never, T> /* 错误替代值 */
}
type CalcReturn<T> =
  | Result<string, NaNError | Error | T>
  | Fn<string, Result<string, NaNError | Error | T>>

/** ## calc : 对[calc](https://github.com/Autumn-one/a-calc-old/blob/main/README_ZH.md)的二次封装
用于 js数字精准计算、数字格式化、完备的舍入规则、单位计算
@example
```ts
  //normal type
  const r2 = calc('1+1000', {}, { fmt: [','] }).unwrap()
  assertEquals(r2, '1,001')

  //curry type
  const r3 = calc({ a: '1.123', b: '2.23' }, { unit: true })('a+b').unwrap()
  assertEquals(r3, '3.353')

  //catch NaNError
  calc({ a: '1.2.3' })('a+2').match_err((err) => { assert(err instanceof NaNError) })
  
```
@tips conf -> fmt: 格式化数组
### 格式化列表规则：
+ `>|>=|<|<=|=`数字 表示限制小数位数，例: <=2 小数位数小于等于2 >3 小数位数必须大于3，这个等价于>=4
+ `,` 输出为千分位数字字符串
+ `/` 输出为分数
+ `+` 输出的正数带+ 号
+ `%` 输出百分比数字，可以和限制小数组合使用
+ `!e` 输出为科学计数法
+ `!n` 输出为数字而不是数字字符串，n可以大写，1.3.6版本之后这个优先级为最高，任何其他的格式化参数无法影响该参数。
+ `!u` 从结果中去除单位
### 四舍五入规则：
+ `~-` 去尾，默认的舍入规则
+ `~+` 进一
+ `~5` 四舍五入
+ `~6` 四舍六入，该舍入规则相较四舍五入更为精准，规则在舍入的后一位为5的时候有所不同，他会查看5后面的位置，如果后面的数字不为0那么会进一，如果后面的数字为0 ，那么会看5前面的数字是否为偶数，如果是则不进，不是则进

@category Function
 */
export function calc<T = never>(
  expr: string | number,
  val_map?: FillData,
  conf?: CalcConf<T>
): Result<string, Error | T>
export function calc<T = never>(
  val_map: FillData,
  conf?: CalcConf<T>,
  other?: never
): Fn<string, Result<string, Error | T>>
export function calc<T = never>(
  arg1: string | number | FillData,
  arg2?: FillData | CalcConf<T>,
  arg3?: CalcConf<T>
): CalcReturn<T> {
  if (typeof arg1 === 'string' || typeof arg1 === 'number') {
    try {
      const { fmt = [], memo = false, unit = false, error = undefined } = arg3 || {}
      const res = a_calc.calc(String(arg1), {
        _memo: memo,
        _error: error,
        _unit: unit,
        _fmt: fmt.join(' '),
        _fill_data: arg2,
      })
      if (typeof res === 'number' && isNaN(res)) return Err(NaNError.new())
      else if (typeof res === 'string' || typeof res === 'number') return pipe(res, String, Ok)
      else return res
    } catch (e) {
      return Err(e)
    }
  } else {
    return (expr: string) => {
      try {
        const {
          fmt = [],
          memo = false,
          unit = false,
          error = undefined,
        } = (arg2 as CalcConf<T>) || {}
        const res = a_calc.calc(expr, {
          _memo: memo,
          _error: error,
          _unit: unit,
          _fmt: fmt.join(' '),
          _fill_data: arg1,
        })
        if (typeof res === 'number' && isNaN(res)) return Err(NaNError.new())
        else if (typeof res === 'string' || typeof res === 'number') return pipe(res, String, Ok)
        else return res
      } catch (e) {
        return Err(e)
      }
    }
  }
}

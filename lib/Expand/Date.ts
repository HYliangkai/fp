import {AnyErr} from '../../mod.ts'
import {Ok, dayjs} from '../mod.ts'

type timestamp = number

declare global {
  interface DateConstructor {
    /**
    ### Usage
    ```ts
    const res =Date.format('2020-02-20', 'YYYY/MM/DD') // 2020/02/20
    ```
    ### 支持的格式化占位符列表
    | 占位符 | 输出             | 详情                                                         |
    | ------ | ---------------- | ------------------------------------------------------------ |
    | `YY`   | 18               | 两位数的年份                                                 |
    | `YYYY` | 2018             | 四位数的年份                                                 |
    | `M`    | 1-12             | 月份，从 1 开始                                              |
    | `MM`   | 01-12            | 月份，两位数                                                 |
    | `MMM`  | Jan-Dec          | 缩写的月份名称                                               |
    | `MMMM` | January-December | 完整的月份名称                                               |
    | `D`    | 1-31             | 月份里的一天                                                 |
    | `DD`   | 01-31            | 月份里的一天，两位数                                         |
    | `d`    | 0-6              | 一周中的一天，星期天是 0                                     |
    | `dd`   | Su-Sa            | 最简写的星期几                                               |
    | `ddd`  | Sun-Sat          | 简写的星期几                                                 |
    | `dddd` | Sunday-Saturday  | 星期几                                                       |
    | `H`    | 0-23             | 小时                                                         |
    | `HH`   | 00-23            | 小时，两位数                                                 |
    | `h`    | 1-12             | 小时, 12 小时制                                              |
    | `hh`   | 01-12            | 小时, 12 小时制, 两位数                                      |
    | `m`    | 0-59             | 分钟                                                         |
    | `mm`   | 00-59            | 分钟，两位数                                                 |
    | `s`    | 0-59             | 秒                                                           |
    | `ss`   | 00-59            | 秒 两位数                                                    |
    | `SSS`  | 000-999          | 毫秒 三位数                                                  |
    | `Z`    | +05:00           | UTC 的偏移量，±HH:mm                                         |
    | `ZZ`   | +0500            | UTC 的偏移量，±HHmm                                          |
    | `A`    | AM PM            |                                                              |
    | `a`    | am pm            |                                                              |
    | ...    | ...              | 其他格式 ( 依赖 [`AdvancedFormat` ](https://dayjs.gitee.io/docs/zh-CN/plugin/advanced-format)插件 ) |
    */
    format(datevalue: any, format: string): AnyResult<string, 'Error'>

    /** ### 将一段可序列化的date-string转化成timestamp */
    stamp(datevalue: any): AnyResult<timestamp, 'Error'>

    /** ### 返回dayjs自己操作 */
    dayjs(datevalue: any): AnyResult<timestamp, 'Error'>
  }
}

Object.defineProperty(Date, 'format', {
  value: function (datevalue: any, format: string) {
    const djs = dayjs(datevalue)
    if (!djs.isValid()) return AnyErr('Error', 'invalid date value', 'Date.format')
    const fm = djs.format(format)
    if (fm == format) return AnyErr('Error', 'invalid format', 'Date.format')
    return Ok(fm)
  },
  writable: false,
})

Object.defineProperty(Date, 'stamp', {
  value: function (datevalue: any) {
    const djs = dayjs(datevalue)
    if (!djs.isValid()) return AnyErr('Error', 'invalid date value', 'Date.stamp')
    return Ok(djs.valueOf())
  },
  writable: false,
})

Object.defineProperty(Date, 'dayjs', {
  value: function (datevalue: any) {
    const djs = dayjs(datevalue)
    if (!djs.isValid()) return AnyErr('Error', 'invalid date value', 'Date.dayjs')
    return Ok(djs)
  },
  writable: false,
})

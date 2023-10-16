import {Either} from 'lib'

Either(left => {
  // left(val)
  left('你好')
})

// infer只能在条件类型的 extends 子句中使用
// infer得到的类型只能在true语句中使用

/** 根据参数内容直接推断返回值 */

type InferParameters<T extends Function> = T extends (args: infer R) => any ? R : never

export function tsd<T>(callback: (cb: (arg: T) => any) => any) {}

tsd(cb => {
  cb(123)
})

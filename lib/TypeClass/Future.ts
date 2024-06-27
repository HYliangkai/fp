import { future_tag, AsyncResult, Result, todo } from '../../mod.ts'

/** ## Future : 异步返回数据 */
class Future {
  _tag = future_tag
}

todo({ title: 'Future', desc: '完成 Future 类', matur_day: '2024-06-28', matur_version: '0.7.3' })
export function future<T, E>() {
  return new Future()
}

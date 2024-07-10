import { future_tag } from '../../mod.ts'
import { todo } from '../todo/mod.ts'

/** ## Future : 异步返回数据 */
class Future {
  _tag = future_tag
  constructor() {}
}

todo({ title: 'Future', desc: '完成 Future 类', matur_version: '0.8.0' })
export function future<T, E>(): Future {
  return new Future()
}

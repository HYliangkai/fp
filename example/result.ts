import {Own} from '../lib/Own.ts'
import {Err, Ok, result} from '../mod.ts'

result<string, Error>(() =>
  Own(Date.now())
    .map(val => val % 2 === 0)
    .match_map(
      () => {
        return '成功'
      },
      () => {
        throw new Error('失败')
      }
    )
    .take()
)

const func = () => (Date.now() % 2 === 0 ? Ok('成功') : Err('失败'))

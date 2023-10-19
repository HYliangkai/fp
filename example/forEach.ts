import {BooleanEither, for_each} from 'lib'

const list = [1, 2, 3, 4, 5, 6, 7, 8]

for_each(list, (res, index, b) => {
  console.log('读取数据', index, res)
  BooleanEither(index > 5).left_do(b)
})

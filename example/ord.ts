/** 一个使用ord的场景就是配合match进行模式匹配,能减少很多冗余的if else */

import {cmp, Default, Eq, Ge, Gr, Lr, match, option} from 'lib'

const result1 = Math.ceil(Math.random() * 100)

const result2 = Math.ceil(Math.random() * 100)

const result = match(
  cmp(result1, result2),
  [Eq, () => '相等'],
  [Gr, () => 'r1大于r2'],
  [Lr, () => 'r2大于r1'],
  [Ge, () => '开启merge==true,r1大于等于r2'],
  [Default, () => '其他情况']
)
console.log(result(), result1, result2)

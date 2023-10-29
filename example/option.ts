/** 在自己的代码中使用Option代替可能会出现None或者undefined的情况*/

import {Default, None, Option, Some} from 'lib'

interface XMao {
  name: string
  age: number
  address: Option<string> //address需要具备default的能力
}

const create_xmao = (): XMao => {
  return Date.now() % 2 === 0
    ? {
        name: 'jiojio',
        age: 18,
        address: Some('七里香'),
      }
    : {
        name: 'dio',
        age: 20,
        address: None,
      }
}
const address = create_xmao().address.unwrap_or('八度空间')

console.log(address)

/** 在不是自己的代码中使用option()将可能为None的代码转为None */

Some(12).some_do(it => {
  console.log(it)
})

const result = Date.now() % 2 === 0 ? Some(12) : None

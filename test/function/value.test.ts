import {None, value} from 'lib'
import {assertEquals, assertThrows} from '../mod.ts'

Deno.test('value', () => {
  interface User {
    name: string
    age: number
    address?: string
  }
  const jiojio: User = {
    name: 'jiojio',
    age: 18,
  }
  const dio: User = {
    name: 'dio',
    age: 19,
    address: 'London',
  }

  assertThrows(value(jiojio, 'address').unwarp)
  assertEquals(value(dio, 'address').unwarp(), 'London')

  //虽然说有了option之后应该要这么赋值
  interface IUser {
    name: string
    age: number
    address: Option<string>
  }

  const bulanda: IUser = {
    name: 'bulanda',
    age: 20,
    address: None,
  }
})

import { immer_proxy } from 'internal/_immerProxy.ts'
import { ReadOnlyError } from '@chzky/fp'
import { assert_throw } from '@chzky/cest'
Deno.test('immer-proxy-basic', () => {
  const user = { name: 'jiojio', age: 18 }

  const immer_user = immer_proxy(user)

  assert_throw(() => {
    //@ts-ignore : test
    immer_user.name = 'changed'
  }, ReadOnlyError)

  assert_throw(() => {
    //@ts-ignore : test
    immer_user.address = 'changed'
  }, ReadOnlyError)
})

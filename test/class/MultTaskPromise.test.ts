import {MultTaskPromise} from '../../mod.ts'
import {assert, assertThrows} from '../mod.ts'

Deno.test('MultTaskPromise', async () => {
  const multp = new MultTaskPromise()

  const timeout = (time: number, desc: string) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(desc)
      }, time)
    })
  }
  multp.set_task_count(3).unwarp()

  assertThrows(() => {
    multp.set_task_count(-1).unwarp()
  }, '没有达到预期抛出异常')

  let tag = false
  function tag_true() {
    tag = true
  }

  multp.add(() => timeout(555, '1s')).then(tag_true)
  multp.add(() => timeout(666, '2s')).then(tag_true)
  multp.add(() => timeout(777, '3s')).then(tag_true)

  await multp
    .add(() => timeout(444, '4s'))
    .then(() => {
      assert(tag)
    })
})

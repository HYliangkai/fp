// import {delegates} from '../../mod.ts'
import {assertEquals} from '../mod.ts'

Deno.test('delegates', () => {
  // const ACall = delegates()
  // const call1 = function () {
  //   return 'call1'
  // }
  // const call2 = () => 'call2'
  // /* 基本的运算符重载 */
  // ACall.onclick += call1 // 0 + 1 -> 1 -> 1>0 (push)
  // ACall.onclick += call2 // 0 + 2 -> 2 -> 2>0 (push)
  // assertEquals(ACall.onclick(), ['call1', 'call2'])
  // ACall.onclick -= call1 as any // 0 - 1 -> -1 -> -1<0 (splice)
  // assertEquals(ACall.onclick(), ['call2'])
  // /* 事件继承 */
  // ACall.onbulr += ACall.onclick
  // assertEquals(ACall.onclick(), ['call2'])
  // ACall.onclick -= ACall.onclick
  // assertEquals(ACall.onclick(), [])
})

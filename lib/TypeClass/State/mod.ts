/** State : 用于存储副作用或者数据,做到副作用/状态 和源数据分离的效果
一个使用场景是在pipe函数中只能返回一个值,但是有时候我们需要返回多个值(譬如不想多次计算的计算结果,这些数据属于状态数据,对于结果没有影响但是为了提高效率要用得到),这时候就可以使用State将主要数数据和副作用数据进分隔开  State<Main,Sub>
 */
import type { State } from './interface.ts'
import { state } from './state.ts'

export { type State, state }
